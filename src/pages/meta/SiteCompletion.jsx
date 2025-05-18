// src/pages/meta/SiteCompletion.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import withLayout from '../../hoc/withLayout.jsx';

const PAGE_TITLE = 'Site Completion';

// ---------------------------------------------------------------------------
// Status palette – tweak colors / labels here
// ---------------------------------------------------------------------------
const STATUS = {
    NOT_STARTED:  { label: 'Not Started',     color: 'bg-red-500'    },
    IN_PROGRESS:  { label: 'In Progress',     color: 'bg-yellow-400' },
    MOSTLY_DONE:  { label: 'Mostly Complete', color: 'bg-lime-400'  },
    COMPLETED:    { label: 'Completed',       color: 'bg-green-500' },
    UPDATING:     { label: 'Updating',        color: 'bg-blue-500'  },
};

// ---------------------------------------------------------------------------
// Current site map
// ---------------------------------------------------------------------------
const siteMap = [
    { name: 'Home',           path: '/',                            status: 'MOSTLY_DONE' },

    {
        name: 'Info',         path: '/info',                        status: 'IN_PROGRESS',
        children: [
            { name: 'Knowledge Bank', path: '/info/knowledgebank',  status: 'NOT_STARTED' },
            { name: 'Mysteries',      path: '/info/mysteries',      status: 'NOT_STARTED' },
            { name: 'Hints',          path: '/info/hints',          status: 'IN_PROGRESS' },
        ],
    },

    {
        name: 'Tools',        path: '/tools',                       status: 'MOSTLY_DONE',
        children: [
            { name: 'Decoder',     path: '/tools/decoder',         status: 'COMPLETED'   },
            { name: 'Spectrogram', path: '/tools/spectrogram',     status: 'IN_PROGRESS' },
        ],
    },

    {
        name: 'Resources',    path: '/resources',                   status: 'IN_PROGRESS',
        children: [
            { name: 'Archive',      path: '/resources/archive',     status: 'NOT_STARTED' },
            { name: 'Transcripts',  path: '/resources/transcripts', status: 'COMPLETED'   },
            { name: 'Recordings',   path: '/resources/recordings',  status: 'NOT_STARTED' },
            { name: 'Sightings',    path: '/resources/sightings',   status: 'NOT_STARTED' },
            // 👉 Add future children here (e.g. /resources/information)
        ],
    },

    { name: 'Links',          path: '/links',                       status: 'MOSTLY_DONE' },

    {
        name: 'Meta',         path: '/meta',                        status: 'UPDATING',
        children: [
            { name: 'About the Creator', path: '/meta/about-the-creator', status: 'IN_PROGRESS' },
            { name: 'About this Site',   path: '/meta/about-this-site',   status: 'IN_PROGRESS' },
            { name: 'Site Completion',   path: '/meta/site-completion',   status: 'UPDATING'   },
        ],
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function PageNode({ node, depth = 0 }) {
    const indentPx = depth * 16; // 1 rem per level
    const statusMeta = STATUS[node.status] || STATUS.NOT_STARTED;

    return (
        <li>
            <div className="flex items-center gap-2" style={{ marginLeft: indentPx }}>
                <span className={`inline-block w-3 h-3 rounded-full ${statusMeta.color}`} />
                {node.path ? (
                    <Link to={node.path} className="underline-offset-2 hover:underline">
                        {node.name}
                    </Link>
                ) : (
                    <span>{node.name}</span>
                )}
            </div>

            {node.children?.length > 0 && (
                <ul className="space-y-1">
                    {node.children.map((child) => (
                        <PageNode key={child.name} node={child} depth={depth + 1} />
                    ))}
                </ul>
            )}
        </li>
    );
}

function Legend() {
    return (
        <div className="flex flex-wrap gap-6">
            {Object.values(STATUS).map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm">{label}</span>
                </div>
            ))}
        </div>
    );
}

function SiteCompletion() {
    return (
        <main className="flex flex-col items-center gap-8 px-4 py-8 overflow-y-auto">
            <h1 className="text-4xl font-bold tracking-tight">{PAGE_TITLE}</h1>

            <Legend />

            <ul className="mt-4 space-y-1">
                {siteMap.map((node) => (
                    <PageNode key={node.name} node={node} />
                ))}
            </ul>
        </main>
    );
}

export default withLayout(SiteCompletion);
