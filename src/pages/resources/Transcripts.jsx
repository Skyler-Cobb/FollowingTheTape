// src/pages/Transcripts.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import withLayout from '../../hoc/withLayout.jsx';

const PAGE_TITLE = 'Transcripts';

// ←–– Manually list your filenames here ↑––↓–– add new ones as you drop in more files
const transcriptFiles = [
    '[1] 1. the house with the strange light.md',
    '[2] ？？？？？？？.md',
    '[3] 2. the abandoned car.md',
    '[4] 3. ....more coffee？.md',
    '[5] $$$ ORDER YOUR VERY OWN BRINE.... TODAY!!!!.md',
    '[6] 4. soooo... i\'ve got some news... .md',
    '[7] 5. the Midnight Riddle Hour.md',
    '[8] ¿.md',
    '[9] 6. are there words.md',
    '[10] Your Personal Deal Guy.md',
    '[11] 833-NO-BRINR.md'
];

function Transcripts() {
    const [selectedFile, setSelectedFile] = useState(transcriptFiles[0]);
    const [content, setContent] = useState('');

    // Fetch the Markdown whenever the selection changes
    useEffect(() => {
        fetch(`/transcripts/${selectedFile}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then(text => setContent(text))
            .catch(err => setContent(`# Error loading transcript\n${err.message}`));
    }, [selectedFile]);

    return (
        <main className="flex min-h-[60vh] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-1/4 border-r bg-gray-50 p-4">
                <h2 className="mb-4 text-xl font-semibold">{PAGE_TITLE}</h2>
                <ul className="space-y-2">
                    {transcriptFiles.map(file => {
                        // turn "[3].md" → "3"
                        const label = file.replace(/^\[(\d+)\]\.md$/, '$1');
                        const isActive = file === selectedFile;
                        return (
                            <li key={file}>
                                <button
                                    onClick={() => setSelectedFile(file)}
                                    className={
                                        `block w-full text-left px-2 py-1 rounded transition ` +
                                        (isActive
                                            ? 'bg-gray-200 font-medium'
                                            : 'hover:bg-gray-100')
                                    }
                                >
                                    Transcript {label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            {/* Content area */}
            <article className="prose flex-1 overflow-auto p-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </article>
        </main>
    );
}

export default withLayout(Transcripts);
