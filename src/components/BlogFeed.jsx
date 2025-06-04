// src/components/BlogFeed.jsx
import React, { useEffect, useState } from 'react';

export default function BlogFeed({ limit = 5 }) {
    const [posts, setPosts]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(false);

    useEffect(() => {
        fetch('/.netlify/functions/blog-feed')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(setPosts)
            .catch(err => {
                console.error('Fetch error:', err);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-gray-400">Loading updates…</p>;
    if (error)   return <p className="text-red-400">Couldn’t load updates.</p>;
    if (!posts.length) return <p className="text-gray-400">No updates yet.</p>;

    return (
        <ul className="space-y-4">
            {posts.slice(0, limit).map(p => (
                <li
                    key={p.link}
                    className="rounded border border-gray-700 p-4 space-y-2"
                >
                    {/* Title (bold, same size as body) */}
                    <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:underline"
                    >
                        {p.title}
                    </a>

                    {/* Date */}
                    <p className="text-xs text-gray-400">
                        {new Date(p.date || Date.now()).toLocaleDateString(undefined, {
                            year:  'numeric',
                            month: 'short',
                            day:   'numeric'
                        })}
                    </p>

                    {/* Render raw HTML here (preserves <p>, <strong>, entities, etc.) */}
                    <div
                        className="text-sm text-gray-300 leading-relaxed space-y-2"
                        dangerouslySetInnerHTML={{ __html: p.contentHtml }}
                    />
                </li>
            ))}
        </ul>
    );
}
