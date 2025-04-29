/* ── src/pages/resources/Transcripts.jsx ───────────────────── */
import React, { useState } from 'react';
import withLayout from '../../hoc/withLayout.jsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* 1 ▌Collect every *.md in public/transcripts at build-time ──
   import.meta.glob works in Vite even for files inside /public.
   { as:'raw', eager:true } returns an object: { path: string ⇒ source: string } */
const modules = import.meta.glob('/public/transcripts/*.md', {
    as: 'raw',
    eager: true,
});

/* 2 ▌Normalize to an array and sort by numeric prefix [n] ────── */
const transcripts = Object.entries(modules)
    .map(([path, source]) => {
        const fileName = path.split('/').pop();
        const [, num, titlePart = 'Transcript'] =
        fileName.match(/^\[(\d+)]\s*([^.]*)/) || [];
        return {
            key: num ? Number(num) : Infinity,
            label: `[${num}] ${titlePart.trim() || 'Transcript'}`,
            md: source,
        };
    })
    .sort((a, b) => a.key - b.key);

/* 3 ▌UI ------------------------------------------------------- */
function Transcripts() {
    const [current, setCurrent] = useState(0);

    if (!transcripts.length) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg text-gray-600">No transcripts found.</p>
            </main>
        );
    }

    const active = transcripts[current];

    return (
        <div className="flex min-h-[70vh] border-t border-gray-300 dark:border-gray-700">
            {/* sidebar */}
            <aside className="w-64 shrink-0 overflow-y-auto border-r border-gray-300 bg-gray-50 dark:bg-gray-800">
                <ul>
                    {transcripts.map((t, i) => (
                        <li key={t.key}>
                            <button
                                onClick={() => setCurrent(i)}
                                className={`w-full px-4 py-2 text-left transition-colors
                  ${
                                    i === current
                                        ? 'bg-brand-500 text-white'
                                        : 'text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {t.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* markdown viewer */}
            <section className="flex-1 overflow-y-auto p-6">
                <ReactMarkdown
                    className="prose max-w-none prose-slate dark:prose-invert"
                    remarkPlugins={[remarkGfm]}
                >
                    {active.md}
                </ReactMarkdown>
            </section>
        </div>
    );
}

export default withLayout(Transcripts);
