// src/pages/resources/Sitemaps.jsx
import React, { useState, useEffect } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import * as dagre from 'dagre';
import Layout from '../../components/Layout';
import 'reactflow/dist/style.css';

const MAX_NODE_WIDTH = 240;
const DEFAULT_PARAMS = {
    lineHeight: 18,
    charWidth: 9,
    textPadding: 30,
    imageHeight: 100,
    edgeLabelMax: 20
};

// Control panel for tweaking layout params

const ControlPanel = ({ params, onParamChange }) => (

    <div style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        width: '300px'
    }}>

        <div className="space-y-4">
            <div>
                <label>Line Height: {params.lineHeight}px</label>
                <input
                    type="range"
                    min="10"
                    max="60"
                    value={params.lineHeight}
                    onChange={e => onParamChange('lineHeight', e.target.value)}
                    className="w-full"
                />
            </div>
            <div>
                <label>Char Width: {params.charWidth}px</label>
                <input
                    type="range"
                    min="5"
                    max="30"
                    value={params.charWidth}
                    onChange={e => onParamChange('charWidth', e.target.value)}
                    className="w-full"
                />
            </div>
            <div>
                <label>Text Padding: {params.textPadding}px</label>
                <input
                    type="range"
                    min="0"
                    max="50"
                    value={params.textPadding}
                    onChange={e => onParamChange('textPadding', e.target.value)}
                    className="w-full"
                />
            </div>
            <div>
                <label>Image Height: {params.imageHeight}px</label>
                <input
                    type="range"
                    min="0"
                    max="200"
                    value={params.imageHeight}
                    onChange={e => onParamChange('imageHeight', e.target.value)}
                    className="w-full"
                />
            </div>
            <div>
                <label>Edge Label Max: {params.edgeLabelMax} chars</label>
                <input
                    type="range"
                    min="5"
                    max="50"
                    value={params.edgeLabelMax}
                    onChange={e => onParamChange('edgeLabelMax', e.target.value)}
                    className="w-full"
                />
            </div>
        </div>
    </div>
);

export default function Sitemaps() {
    const [layoutParams, setLayoutParams] = useState(DEFAULT_PARAMS);
    const { lineHeight, charWidth, textPadding, imageHeight, edgeLabelMax } = layoutParams;

    // Dynamically import JSON maps
    const modules = import.meta.glob('../../resources/sitemaps/*.json', { eager: true });
    const mapOptions = Object.entries(modules).map(([path, mod]) => ({
        fileName: path.split('/').pop(),
        data: mod.default || mod
    }));

    // Import images as URLs
    const imgModules = import.meta.glob(
        '../../resources/sitemaps/images/*',
        { eager: true, as: 'url' }
    );
    const imageMap = Object.fromEntries(
        Object.entries(imgModules).map(([path, url]) => [path.split('/').pop(), url])
    );

    const [selectedFile, setSelectedFile] = useState('reachingspacesorg-v1.json');
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    // compute node size using dynamic params
    const calculateNodeSize = (label) => {
        const words = label.split(' ');
        const lines = [];
        let curr = '';
        for (const w of words) {
            const test = curr ? `${curr} ${w}` : w;
            if (test.length * charWidth > MAX_NODE_WIDTH - textPadding) {
                lines.push(curr);
                curr = w;
            } else curr = test;
        }
        if (curr) lines.push(curr);
        const width = Math.min(
            Math.max(...lines.map(l => l.length * charWidth)) + textPadding,
            MAX_NODE_WIDTH
        );
        const height = lines.length * lineHeight + textPadding;
        return { width, height };
    };

    const wrapEdgeLabel = (text) =>
        text
            .split(' ')
            .reduce((lines, word) => {
                const last = lines[lines.length - 1] || '';
                const cand = last ? `${last} ${word}` : word;
                if (cand.length > edgeLabelMax) lines.push(word);
                else lines[lines.length - 1] = cand;
                return lines;
            }, [''])
            .join('\n');

    useEffect(() => {
        const opt = mapOptions.find(o => o.fileName === selectedFile);
        if (!opt) return;
        const raw = opt.data.nodes;
        const byId = Object.fromEntries(raw.map(n => [n.id, n]));

        // duplicate endings per connection
        const procNodes = raw.filter(n => n.type !== 'ending').map(n => ({ ...n }));
        const procEdges = [];
        raw.forEach(n => {
            if (!n.connections) return;
            Object.entries(n.connections).forEach(([to, label]) => {
                const tgt = byId[to];
                if (tgt?.type === 'ending') {
                    const dup = `${to}--from--${n.id}`;
                    procNodes.push({
                        id: dup,
                        type: 'ending',
                        data: { label: tgt.data.label },
                        attachment: tgt.attachment,
                        foreground: tgt.foreground,
                        background: tgt.background
                    });
                    procEdges.push({ source: n.id, target: dup, label });
                } else procEdges.push({ source: n.id, target: to, label });
            });
        });

        // Dagre layout
        const g = new dagre.graphlib.Graph();
        g.setGraph({ rankdir: 'TB', nodesep: 120, ranksep: 150 });
        g.setDefaultEdgeLabel(() => ({}));
        procNodes.forEach(n => {
            const { width, height: tH } = calculateNodeSize(n.data.label);
            const height = tH + (n.attachment ? imageHeight : 0);
            g.setNode(n.id, { width, height });
        });
        procEdges.forEach(e => g.setEdge(e.source, e.target));
        dagre.layout(g);

        // build RF nodes
        const rfNodes = procNodes.map(n => {
            const { width, height: tH } = calculateNodeSize(n.data.label);
            const height = tH + (n.attachment ? imageHeight : 0);
            const pos = g.node(n.id);
            const style = { width, height };
            if (n.background) style.background = n.background;
            else if (n.type === 'ending') style.background = '#f8d7da';
            else if (n.type === 'entrance') style.background = '#d1fae5';
            if (n.foreground) style.color = n.foreground;
            return {
                id: n.id,
                data: {
                    label: (
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:4, fontSize:14, lineHeight:1.3, width:'100%', height:'100%', boxSizing:'border-box' }}>
                            {n.attachment && imageMap[n.attachment] && (
                                <img src={imageMap[n.attachment]} alt="" style={{ width:'calc(100% - 8px)', height:'auto', maxHeight:`${imageHeight}px`, objectFit:'contain', marginBottom:4 }} />
                            )}
                            <div style={{ textAlign:'center', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                                {n.data.label}
                            </div>
                        </div>
                    )
                },
                position:{ x: pos.x - width/2, y: pos.y - height/2 },
                style,
                sourcePosition:'bottom',
                targetPosition:'top'
            };
        });

        const rfEdges = procEdges.map(e=>({
            id:`${e.source}-${e.target}`,
            source:e.source,
            target:e.target,
            type:'step',
            label:wrapEdgeLabel(e.label),
            labelStyle:{ fontSize:12, fill:'#94a3b8', textAlign:'center', whiteSpace:'pre-wrap', wordBreak:'break-word' },
            markerEnd:{ type:'arrowclosed' }
        }));

        setNodes(rfNodes);
        setEdges(rfEdges);
    }, [selectedFile, layoutParams]);

    return (
        <Layout>
            <div className="p-4 bg-white shadow flex items-center space-x-2 sticky top-0 z-40">
                <label htmlFor="map-select" className="text-gray-700 font-medium">Choose map:</label>
                <select id="map-select" value={selectedFile} onChange={e=>setSelectedFile(e.target.value)} className="bg-white text-black border border-gray-300 rounded px-2 py-1 z-50">
                    {mapOptions.map(o=><option key={o.fileName} value={o.fileName}>{o.fileName}</option>)}
                </select>
            </div>

            {/* Control Panel <ControlPanel params={layoutParams} onParamChange={(k,v)=>setLayoutParams(p=>({...p,[k]:parseInt(v)}))} /> */}

            <div style={{ width:'100%', height:'calc(100vh - 80px)' }}>
                <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.1} maxZoom={2} defaultEdgeOptions={{ type:'step', style:{ strokeWidth:1.5, stroke:'#94a3b8' }, labelStyle:{ whiteSpace:'pre-wrap', wordBreak:'break-word', textAlign:'center' } }}>
                    <Controls showInteractive={false}/>
                    <Background gap={24} color="#cbd5e1"/>
                </ReactFlow>
            </div>
        </Layout>
    );
}
