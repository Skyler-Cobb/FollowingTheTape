import React, { useEffect, useState } from 'react';

export default function BlogFeed({ limit = 5 }) {
    const [posts, setPosts]   = useState([]);
    const [err,   setErr]     = useState(null);
    const [busy,  setBusy]    = useState(true);

    useEffect(() => {
        fetch('/.netlify/functions/blog-feed')
            .then(r => r.json())
            .then(setPosts)
            .catch(setErr)
            .finally(() => setBusy(false));
    }, []);

    if (busy) return <p className="text-gray-400">Loading updates…</p>;
    if (err)  return <p className="text-red-400">Couldn’t load updates.</p>;
    if (!posts.length) return null;

    return (
        <section className="mt-10 space-y-6">
            <h2 className="text-2xl font-semibold">Latest&nbsp;Updates</h2>

            <ul className="space-y-4">
                {posts.slice(0, limit).map((p) => (
                    <li key={p.link} className="rounded border border-gray-700 p-4">
                        <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-indigo-400 hover:underline"
                        >
                            {p.title}
                        </a>
                        <p className="mt-1 text-xs text-gray-400">
                            {new Date(p.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                        {p.excerpt && (
                            <p className="mt-2 text-sm text-gray-300">{p.excerpt}</p>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}
