// Sitemaps.jsx — ELK + ReactFlow hybrid with ending‐node duplication

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import Layout from '../../components/Layout';
import 'reactflow/dist/style.css';

// ELK layout configurations (with tighter force spacing)
const ELK_LAYOUTS = {
    'layered-crossing-min': {
        'elk.algorithm': 'layered',
        'elk.direction': 'DOWN',
        'elk.spacing.nodeNode': '100',
        'elk.layered.spacing.nodeNodeBetweenLayers': '120',
        'elk.layered.spacing.edgeNodeBetweenLayers': '30',
        'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
        'elk.layered.crossingMinimization.greedySwitch.type': 'TWO_SIDED',
        'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
        'elk.layered.nodePlacement.favorStraightEdges': 'true',
        'elk.layered.wrapping.strategy': 'SINGLE_EDGE',
        'elk.layered.wrapping.additionalEdgeSpacing': '20',
        'elk.layered.cycleBreaking.strategy': 'GREEDY',
        'elk.layered.thoroughness': '10'
    },
    'force-crossing-min': {
        'elk.algorithm': 'force',
        'elk.force.repulsion': '1.0',       // less repulsion = tighter
        'elk.force.temperature': '0.05',
        'elk.force.iterations': '1000',
        'elk.spacing.nodeNode': '1',         // closer nodes
        'elk.force.edgeElasticity': '1.0',
        'elk.force.strength': '0.1'
    },
    'stress-minimal': {
        'elk.algorithm': 'stress',
        'elk.stress.epsilon': '0.0001',
        'elk.stress.iterationLimit': '1000',
        'elk.spacing.nodeNode': '150',
        'elk.stress.desiredEdgeLength': '150.0'
    },
    'rectpacking-clustered': {
        'elk.algorithm': 'rectpacking',
        'elk.rectpacking.acrossLevelFactor': '1.2',
        'elk.spacing.nodeNode': '100',
        'elk.rectpacking.lastPlaceShift': 'true'
    }
};

// Hook to run ELK and map back into RF with dynamic import
function useELKLayout(nodes, edges, layoutKey) {
    const [layouted, setLayouted] = useState({ nodes: [], edges: [] });
    const [isLayouting, setIsLayouting] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (!nodes.length || !layoutKey) return;
        setIsLayouting(true);
        const t0 = Date.now();

        // dynamically import ELK as an ES module
        import('elkjs/lib/elk.bundled.js')
            .then(({ default: ELK }) => {
                const elk = new ELK();
                const graph = {
                    id: 'root',
                    layoutOptions: ELK_LAYOUTS[layoutKey],
                    children: nodes.map(n => ({
                        id: n.id,
                        width: n.style.width,
                        height: n.style.height
                    })),
                    edges: edges.map(e => ({
                        id: e.id,
                        sources: [e.source],
                        targets: [e.target]
                    }))
                };

                return elk.layout(graph).then(result => {
                    const t1 = Date.now();
                    const laidNodes = result.children.map(c => {
                        const orig = nodes.find(n => n.id === c.id);
                        return { ...orig, position: { x: c.x, y: c.y } };
                    });

                    const crossings = calculateCrossings(laidNodes, edges);
                    setStats({ algorithm: layoutKey, crossings, time: t1 - t0, nodes: nodes.length, edges: edges.length });
                    setLayouted({ nodes: laidNodes, edges });
                });
            })
            .catch(err => {
                console.error('ELK dynamic import/layout error:', err);
                setLayouted({ nodes, edges });
            })
            .finally(() => setIsLayouting(false));
    }, [nodes, edges, layoutKey]);

    return { ...layouted, isLayouting, stats };
}

// Line‐segment intersection for crossing count
function linesIntersect(p1, p2, p3, p4) {
    const d = (p1.x-p2.x)*(p3.y-p4.y) - (p1.y-p2.y)*(p3.x-p4.x);
    if (Math.abs(d) < 1e-6) return false;
    const t = ((p1.x-p3.x)*(p3.y-p4.y) - (p1.y-p3.y)*(p3.x-p4.x)) / d;
    const u = ((p1.x-p2.x)*(p1.y-p3.y) - (p1.y-p2.y)*(p1.x-p3.x)) / d;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

function calculateCrossings(nodes, edges) {
    const pos = new Map(nodes.map(n => [n.id, n.position]));
    let count = 0;
    for (let i = 0; i < edges.length; i++) {
        for (let j = i + 1; j < edges.length; j++) {
            const e1 = edges[i], e2 = edges[j];
            const p1 = pos.get(e1.source), p2 = pos.get(e1.target);
            const p3 = pos.get(e2.source), p4 = pos.get(e2.target);
            if (p1 && p2 && p3 && p4 && linesIntersect(p1, p2, p3, p4)) count++;
        }
    }
    return count;
}

// Node fill colors
const getNodeColor = type => {
    const map = {
        entrance: '#d1fae5',
        ending:   '#f8d7da',
        investigation: '#fff3e0',
        dialogue: '#f3e5f5'
    };
    return map[type] || '#f5f5f5';
};

export default function Sitemaps() {
    const [algorithm, setAlgorithm] = useState('layered-crossing-min');
    const [selectedNode, setSelectedNode] = useState(null);
    const [manualPos, setManualPos] = useState({});
    const [showCompare, setShowCompare] = useState(false);
    const [rfInstance, setRfInstance] = useState(null);

    // Load all JSON maps
    const modules = import.meta.glob('../../resources/sitemaps/*.json', { eager: true });
    const mapOptions = Object.entries(modules).map(([path, mod]) => ({
        name: path.split('/').pop(),
        data: mod.default || mod
    }));
    const [chosenMap, setChosenMap] = useState(mapOptions[0]?.name);
    const selectedData = mapOptions.find(m => m.name === chosenMap)?.data;

    // Build RF nodes & edges, duplicating endings
    const { rfNodes, rfEdges } = useMemo(() => {
        if (!selectedData?.nodes) return { rfNodes: [], rfEdges: [] };

        // 1) Base nodes (non-endings)
        const base = selectedData.nodes
            .filter(n => n.type !== 'ending')
            .map(n => {
                const w = n.width || 200;
                const h = Math.min(n.height || 100, 150);  // clamp tall nodes
                return {
                    id: n.id,
                    data: { label: n.data?.label || n.id, fixed: manualPos[n.id] != null },
                    position: manualPos[n.id] || { x: 0, y: 0 },
                    style: {
                        background: getNodeColor(n.type),
                        border: '1px solid #444',
                        borderRadius: 8,
                        padding: 8,
                        width: w,
                        height: h,
                        overflowY: 'auto',
                        color: 'black'
                    }
                };
            });

        // 2) Clone endings & build label/branch edges
        const clones = [];
        const labels = [];
        const edges = [];

        selectedData.nodes.forEach(n => {
            const conns = n.connections || {};
            Object.entries(conns).forEach(([tgt, lbl]) => {
                // If target is an ending, clone it
                let targetId = tgt;
                const orig = selectedData.nodes.find(x => x.id === tgt);
                if (orig?.type === 'ending') {
                    const cloneId = `end-${n.id}-${tgt}`;
                    clones.push({
                        id: cloneId,
                        data: { label: orig.data?.label || orig.id, fixed: manualPos[cloneId] != null },
                        position: manualPos[cloneId] || { x: 0, y: 0 },
                        style: {
                            background: getNodeColor(orig.type),
                            border: '1px solid #444',
                            borderRadius: 8,
                            padding: 8,
                            width: orig.width || 200,
                            height: Math.min(orig.height || 100, 150),
                            overflowY: 'auto',
                            color: 'black'
                        }
                    });
                    targetId = cloneId;
                }

                // Create a label‐node at midpoint
                const lblId = `lbl-${n.id}-${tgt}`;
                labels.push({
                    id: lblId,
                    data: { label: lbl },
                    position: { x: 0, y: 0 },
                    style: {
                        background: '#e0e0e0',
                        border: '1px solid #888',
                        borderRadius: 4,
                        padding: 4,
                        width: 120,
                        height: 30,
                        textAlign: 'center',
                        color: 'black'
                    }
                });

                // Edge: source → label
                edges.push({
                    id: `e-${n.id}-${tgt}-1`,
                    source: n.id,
                    target: lblId,
                    markerEnd: { type: 'arrowclosed', color: '#555' },
                    style: { stroke: '#555', strokeWidth: 1 }
                });
                // Edge: label → (possibly cloned) target
                edges.push({
                    id: `e-${n.id}-${tgt}-2`,
                    source: lblId,
                    target: targetId,
                    markerEnd: { type: 'arrowclosed', color: '#555' },
                    style: { stroke: '#555', strokeWidth: 1 }
                });
            });
        });

        return {
            rfNodes: [...base, ...clones, ...labels],
            rfEdges: edges
        };
    }, [selectedData, manualPos]);

    // Run ELK
    const { nodes: laid, edges: laidEdges, isLayouting, stats } =
        useELKLayout(rfNodes, rfEdges, algorithm);

    // Auto‐recenter when algorithm changes or layout completes
    useEffect(() => {
        if (rfInstance && !isLayouting) {
            rfInstance.fitView({ padding: 0.2 });
        }
    }, [laid, algorithm, isLayouting, rfInstance]);

    // Handlers
    const onInit = useCallback(inst => setRfInstance(inst), []);
    const onNodeClick = useCallback((_, n) => setSelectedNode(n), []);
    const updatePos = useCallback((id, pos) => {
        setManualPos(mp => ({ ...mp, [id]: pos }));
        setSelectedNode(null);
    }, []);
    const toggleFixed = useCallback(id => {
        setManualPos(mp => {
            const c = { ...mp };
            if (c[id]) delete c[id];
            else {
                const node = laid.find(x => x.id === id);
                if (node) c[id] = node.position;
            }
            return c;
        });
        setSelectedNode(null);
    }, [laid]);
    const resetAll = useCallback(() => {
        setManualPos({});
        setSelectedNode(null);
    }, []);

    return (
        <Layout>
            <div className="h-screen flex">
                {/* Sidebar */}
                <div className="w-72 bg-gray-900 p-4 space-y-4 overflow-auto border-r border-gray-700">
                    {/* Map selector */}
                    <div>
                        <label className="block text-sm text-gray-300">Map File</label>
                        <select
                            className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded p-1"
                            value={chosenMap}
                            onChange={e => setChosenMap(e.target.value)}>
                            {mapOptions.map(m => (
                                <option key={m.name} value={m.name}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Algorithm selector */}
                    <div className="p-3 bg-gray-800 rounded shadow space-y-2">
                        <label className="block text-sm text-gray-200">Algorithm</label>
                        <select
                            className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded p-1"
                            value={algorithm}
                            onChange={e => setAlgorithm(e.target.value)}
                            disabled={isLayouting}>
                            {Object.keys(ELK_LAYOUTS).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                        {stats && (
                            <div className="text-xs text-gray-400 mt-2 space-y-1">
                                <div>Nodes: {stats.nodes}</div>
                                <div>Edges: {stats.edges}</div>
                                <div>Crossings: {stats.crossings}</div>
                                <div>Time: {stats.time}ms</div>
                            </div>
                        )}
                    </div>

                    {/* Compare toggle */}
                    <div className="flex items-center space-x-2 text-gray-300">
                        <input
                            type="checkbox"
                            checked={showCompare}
                            onChange={e => setShowCompare(e.target.checked)}
                            className="rounded text-blue-400 bg-gray-800 border-gray-600" />
                        <label className="text-sm">Show Comparison</label>
                    </div>

                    {/* Manual positioning */}
                    <div className="p-3 bg-gray-800 rounded shadow text-xs text-gray-400">
                        {selectedNode
                            ? (
                                <>
                                    <div className="font-semibold text-gray-100 mb-1">Node {selectedNode.id}</div>
                                    <div className="flex space-x-2 mb-2">
                                        <input
                                            type="number"
                                            value={selectedNode.position.x}
                                            onChange={e => updatePos(selectedNode.id, { ...selectedNode.position, x: +e.target.value })}
                                            className="w-16 bg-gray-700 text-gray-100 border border-gray-600 rounded p-1 text-xs" />
                                        <input
                                            type="number"
                                            value={selectedNode.position.y}
                                            onChange={e => updatePos(selectedNode.id, { ...selectedNode.position, y: +e.target.value })}
                                            className="w-16 bg-gray-700 text-gray-100 border border-gray-600 rounded p-1 text-xs" />
                                    </div>
                                    <button
                                        onClick={() => toggleFixed(selectedNode.id)}
                                        className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                                        {selectedNode.data.fixed ? 'Unfix' : 'Fix'}
                                    </button>
                                </>
                            )
                            : 'Select a node to fix/drag.'}
                    </div>

                    {/* Reset */}
                    <button
                        onClick={resetAll}
                        className="w-full bg-red-700 text-white rounded py-1 text-sm">
                        Reset All
                    </button>
                </div>

                {/* Canvas */}
                <div className="flex-1 relative">
                    {isLayouting && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-80 z-20 flex items-center justify-center">
                            <span className="text-gray-200">Computing layout…</span>
                        </div>
                    )}
                    <ReactFlow
                        nodes={laid}
                        edges={laidEdges}
                        onInit={onInit}
                        onNodeClick={onNodeClick}
                        fitView
                        minZoom={0.05}
                        maxZoom={3}>
                        <MiniMap nodeColor={() => '#555'} nodeStrokeColor={() => '#888'} />
                        <Controls showInteractive={false} />
                        <Background gap={12} size={1} color="#444" />
                    </ReactFlow>

                    {showCompare && stats && (
                        <div className="absolute bottom-4 right-4 p-2 bg-gray-800 bg-opacity-75 rounded shadow text-xs text-gray-300">
                            <div><strong>Algo:</strong> {stats.algorithm}</div>
                            <div><strong>Crossings:</strong> {stats.crossings}</div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
