import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import withLayout from '../../hoc/withLayout.jsx'

const PAGE_TITLE = 'Transcripts'
const transcriptsMeta = [
    { id: '1',  label: '1. the house with the strange light',         file: '[1] 1. the house with the strange light.md' },
    { id: '2',  label: '???????',                                      file: '[2] ？？？？？？？.md' },
    { id: '3',  label: '2. the abandoned car',                         file: '[3] 2. the abandoned car.md' },
    { id: '4',  label: '3. ....more coffee?',                         file: '[4] 3. ....more coffee？.md' },
    { id: '5',  label: '$$$ ORDER YOUR VERY OWN BRINE.... TODAY!!!!', file: '[5] $$$ ORDER YOUR VERY OWN BRINE.... TODAY!!!!.md' },
    { id: '6',  label: "4. soooo... i've got some news...",           file: "[6] 4. soooo... i've got some news... .md" },
    { id: '7',  label: '5. the Midnight Riddle Hour',                  file: '[7] 5. the Midnight Riddle Hour.md' },
    { id: '8',  label: '¿',                                           file: '[8] ¿.md' },
    { id: '9',  label: '6. are there words?',                         file: '[9] 6. are there words.md' },
    { id: '10', label: 'Your Personal Deal Guy',                      file: '[10] Your Personal Deal Guy.md' },
    { id: '11', label: '833-NO-BRINR',                                file: '[11] 833-NO-BRINR.md' },
]

function Transcripts() {
    const [selected, setSelected] = useState(transcriptsMeta[0])
    const [title, setTitle] = useState('')
    const [embedHtml, setEmbedHtml] = useState('')
    const [markdownBody, setMarkdownBody] = useState('')

    useEffect(() => {
        fetch(`/transcripts/${selected.file}`)
            .then((res) => {
                if (!res.ok) throw new Error(res.status)
                return res.text()
            })
            .then((text) => {
                // 1) Extract the bold **Title**
                const titleMatch = text.match(/^\s*\*\*(.+?)\*\*/m)
                const pageTitle = titleMatch?.[1] ?? selected.label

                // 2) Extract the iframe after "Embed Code:"
                const embedMatch = text.match(/Embed Code:\s*(<iframe[\s\S]*?<\/iframe>)/i)
                let rawEmbed = embedMatch?.[1] || ''
                rawEmbed = rawEmbed.replace(/(width|height)="[^"]*"/g, '')

                // 3) Remove those lines from the markdown body
                let body = text
                    .replace(titleMatch?.[0] ?? '', '')
                    .replace(embedMatch?.[0] ?? '', '')
                body = body.replace(/^\s*\n/, '')

                setTitle(pageTitle)
                setEmbedHtml(rawEmbed)
                setMarkdownBody(body)
            })
            .catch((err) => {
                setTitle('Error')
                setEmbedHtml('')
                setMarkdownBody(`Failed to load transcript: ${err.message}`)
            })
    }, [selected])

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside className="w-1/4 flex-shrink-0 border-r bg-gray-800 text-gray-200 p-4 overflow-y-auto">
                <h2 className="mb-4 text-xl font-semibold">{PAGE_TITLE}</h2>

                {embedHtml && (
                    <div
                        className="mb-6 aspect-video w-full overflow-hidden rounded-md"
                        dangerouslySetInnerHTML={{ __html: embedHtml }}
                    />
                )}

                <ul className="space-y-2">
                    {transcriptsMeta.map((meta) => (
                        <li key={meta.id}>
                            <button
                                onClick={() => setSelected(meta)}
                                className={
                                    `block w-full text-left px-2 py-1 rounded transition ` +
                                    (meta.id === selected.id
                                        ? 'bg-gray-700 font-medium'
                                        : 'hover:bg-gray-700')
                                }
                            >
                                {meta.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* ── Transcript Viewer ────────────────────────────────── */}
            <section className="prose flex-1 overflow-y-auto p-6">
                {title && <h1 className="mb-4 text-2xl font-bold">{title}</h1>}
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        table({ node, ...props }) {
                            return (
                                <table
                                    {...props}
                                    className="transcript-table w-full border-collapse"
                                />
                            )
                        },
                    }}
                >
                    {markdownBody}
                </ReactMarkdown>
            </section>
        </div>
    )
}

export default withLayout(Transcripts)
