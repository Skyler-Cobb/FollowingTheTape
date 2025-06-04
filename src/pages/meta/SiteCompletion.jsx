// src/pages/meta/SiteCompletion.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import withLayout from '../../hoc/withLayout.jsx';

// ---------------------------------------------------------------------------
// Status definitions (with color classes)
// ---------------------------------------------------------------------------
const STATUS = {
    NOT_STARTED:  { label: 'Not Started',     color: 'bg-red-500'    },
    IN_PROGRESS:  { label: 'In Progress',     color: 'bg-yellow-400' },
    MOSTLY_DONE:  { label: 'Mostly Complete', color: 'bg-lime-400'   },
    COMPLETED:    { label: 'Completed',       color: 'bg-green-500'  },
    UPDATING:     { label: 'Updating',        color: 'bg-blue-500'   },
};

// ---------------------------------------------------------------------------
// Site structure data
// ---------------------------------------------------------------------------
const siteMap = [
    {
        name: 'Home',
        path: '/',
        status: 'MOSTLY_DONE',
        children: [
            { name: 'Updates', path: '/updates', status: 'IN_PROGRESS' },
        ],
    },
    {
        name: 'Info',
        path: '/info',
        status: 'IN_PROGRESS',
        children: [
            { name: 'Uploads',        path: '/info/uploads',        status: 'COMPLETED'   },
            { name: 'Knowledge Bank', path: '/info/knowledgebank',  status: 'NOT_STARTED' },
            { name: 'Mysteries',      path: '/info/mysteries',      status: 'NOT_STARTED' },
            { name: 'Hints',          path: '/info/hints',          status: 'IN_PROGRESS' },
        ],
    },
    {
        name: 'Tools',
        path: '/tools',
        status: 'UPDATING',
        children: [
            { name: 'Decoder',     path: '/tools/decoder',     status: 'UPDATING'  },
            { name: 'Spectrogram', path: '/tools/spectrogram', status: 'COMPLETED' },
        ],
    },
    {
        name: 'Resources',
        path: '/resources',
        status: 'IN_PROGRESS',
        children: [
            { name: 'Archive',     path: '/resources/archive',     status: 'NOT_STARTED' },
            { name: 'Transcripts', path: '/resources/transcripts', status: 'IN_PROGRESS' },
            { name: 'Recordings',  path: '/resources/recordings',  status: 'NOT_STARTED' },
            { name: 'Sightings',   path: '/resources/sightings',   status: 'NOT_STARTED' },
            { name: 'Sitemaps',    path: '/resources/sitemaps',    status: 'MOSTLY_DONE' },
        ],
    },
    {
        name: 'Links',
        path: '/links',
        status: 'COMPLETED',
        children: [],
    },
    {
        name: 'Meta',
        path: '/meta',
        status: 'IN_PROGRESS',
        children: [
            { name: 'About The Creator', path: '/meta/about-the-creator', status: 'NOT_STARTED' },
            { name: 'About This Site',   path: '/meta/about-this-site',   status: 'NOT_STARTED' },
            { name: 'Site Completion',   path: '/meta/site-completion',   status: 'UPDATING'    },
            { name: 'Contact Me',        path: '/meta/contact-me',        status: 'COMPLETED'   },
            { name: 'Legal',             path: '/meta/legal',             status: 'COMPLETED'   },
        ],
    },
];

// ---------------------------------------------------------------------------
// Detailed progress items
// ---------------------------------------------------------------------------
const progressDetails = {
    bugFixes: [
        'Fix errors found in the "Keyboard Symbol Cipher" decoder setting',
        'Reduce stuttering/jittery behavior in the Spectrogram',
    ],
    minorUpdates: [
        'Add "Updates" feed with small, informative updates to the homepage',
    ],
    majorUpdates: [
        'Rework site formatting to be mobile-friendly',
        'Add a new wiki with information on various in-universe people, places, and concepts to the site in the "Knowledge Bank" page',
        'Add all new modules/options to the Decoder, including the ability to use ciphers like the Caesar Cipher/Keyboard Cipher, and chain together different translations (such as "interpret this message using the Keyboard Symbol Cipher, then shift it 3 to the right according to Keyboard Cipher")',
    ],
};

// ---------------------------------------------------------------------------
// Legend component for status color key
// ---------------------------------------------------------------------------
function Legend() {
    return (
        <div className="flex flex-wrap gap-6 mb-6">
            {Object.values(STATUS).map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm">{label}</span>
                </div>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Utility: format relative time without seconds when >= 1 hour
// ---------------------------------------------------------------------------
function formatRelativeTime(dateString) {
    const now = Date.now();
    const past = new Date(dateString).getTime();
    let delta = Math.floor((now - past) / 1000); // total seconds elapsed

    // Define units in descending order
    const units = [
        { name: 'week',   seconds: 7 * 24 * 60 * 60 },
        { name: 'day',    seconds: 24 * 60 * 60 },
        { name: 'hour',   seconds: 60 * 60 },
        { name: 'minute', seconds: 60 },
        { name: 'second', seconds: 1 },
    ];

    // If under one hour, include minutes & seconds
    if (delta < 3600) {
        const mins = Math.floor(delta / 60);
        const secs = delta % 60;
        const parts = [];
        if (mins > 0) parts.push(`${mins} minute${mins !== 1 ? 's' : ''}`);
        parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
        return parts.join(', ') + ' ago';
    }

    // Otherwise (>= 1 hour), ignore seconds
    const filteredUnits = units.filter((u) => u.name !== 'second');
    const parts = [];
    let count = 0;
    for (let i = 0; i < filteredUnits.length && count < 2; i++) {
        const { name, seconds } = filteredUnits[i];
        const value = Math.floor(delta / seconds);
        if (value > 0) {
            parts.push(`${value} ${name}${value !== 1 ? 's' : ''}`);
            delta -= value * seconds;
            count++;
        }
    }
    return parts.join(', ') + ' ago';
}

// ---------------------------------------------------------------------------
// RecentCommits component – fetches commits in pages of 50 when expanded,
// initial 5 when collapsed, scroll only when expanded, with "Load more..."
// ---------------------------------------------------------------------------
function RecentCommits() {
    const [commits, setCommits] = useState([]);
    const [page, setPage] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const repoOwner = 'Skyler-Cobb';
    const repoName = 'FollowingTheTape';
    const perPage = isExpanded ? 20 : 5;

    useEffect(() => {
        const fetchCommits = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=${perPage}&page=${page}`
                );
                if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
                const data = await response.json();
                setCommits(prev => (page === 1 ? data : [...prev, ...data]));
                setHasMore(data.length === perPage);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCommits();
    }, [isExpanded, page]);

    const handleToggleExpand = () => {
        if (isExpanded) {
            setIsExpanded(false);
            setPage(1);
            setHasMore(true);
        } else {
            setIsExpanded(true);
            setPage(1);
            setHasMore(true);
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !loading) setPage(prev => prev + 1);
    };

    return (
        <section className="w-full mt-12">
            <h2 className="text-2xl font-semibold mb-4">Recent Commits</h2>
            <div className="relative border rounded-lg bg-gray-800 text-white p-4">
                {/* GitHub link */}
                <div className="absolute top-3 right-3 text-sm">
                    <a
                        href={`https://github.com/${repoOwner}/${repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-gray-200"
                    >
                        View on GitHub
                    </a>
                </div>

                {loading && <p className="text-gray-200">Loading commits...</p>}
                {error && <p className="text-red-400">Error: {error}</p>}

                {/* Scrollable list */}
                <ul
                    className={`mt-2 space-y-4 ${
                        isExpanded ? 'max-h-[600px] overflow-y-auto' : ''
                    }`}
                >
                    {!loading &&
                        !error &&
                        commits.map(({ sha, commit, html_url }) => {
                            const message = commit.message.split('\n')[0];
                            const dateStr = new Date(commit.author.date).toLocaleString();
                            const relative = formatRelativeTime(commit.author.date);
                            return (
                                <li key={sha} className="border-l-4 border-gray-600 pl-3 list-none">
                                    <a
                                        href={html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:underline font-medium"
                                    >
                                        {message}
                                    </a>
                                    <div className="text-sm text-gray-400">
                                        {dateStr} <span>({relative})</span>
                                    </div>
                                </li>
                            );
                        })}

                    {/* "Load More" or "That's the end..." as last item */}
                    {isExpanded && !loading && !error && (
                        <li className="text-center">
                            {hasMore ? (
                                <button
                                    onClick={handleLoadMore}
                                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                                >
                                    Load More...
                                </button>
                            ) : (
                                <span className="text-gray-400 text-sm">That's the end...</span>
                            )}
                        </li>
                    )}
                </ul>

                {/* Expand/Collapse button */}
                {!loading && !error && commits.length > 0 && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleToggleExpand}
                            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                        >
                            {isExpanded ? 'Show Less' : 'Show More'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}


// ---------------------------------------------------------------------------
// SiteCompletion component
// ---------------------------------------------------------------------------
function SiteCompletion() {
    return (
        <main className="flex flex-col items-center gap-8 px-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight">Site Completion</h1>

            {/* Color key legend */}
            <Legend />

            {/* ----------------------------------------------------------------- */}
            {/* Section 1: Site structure in a responsive “table” grid             */}
            {/* ----------------------------------------------------------------- */}
            <section className="w-full">
                <h2 className="text-2xl font-semibold mb-4">Per-Page Progress</h2>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 text-center">
                    {siteMap.map((section) => {
                        const { label: statusLabel, color: statusColor } =
                        STATUS[section.status] || STATUS.NOT_STARTED;
                        return (
                            <div
                                key={section.name}
                                className="border rounded-lg p-4 bg-gray-800 text-white flex flex-col"
                            >
                                {/* Header with colored dot */}
                                <div className="flex items-center justify-center gap-2">
                                    <span className={`inline-block w-3 h-3 rounded-full ${statusColor}`} />
                                    <h2 className="font-bold">{section.name}</h2>
                                </div>

                                {/* Nested pages (if any) */}
                                {section.children.length > 0 && (
                                    <ul className="mt-2 space-y-1 text-left">
                                        {section.children.map((child) => {
                                            const { color: childColor } =
                                            STATUS[child.status] || STATUS.NOT_STARTED;
                                            return (
                                                <li key={child.name} className="flex items-center gap-2">
                                                    <span className={`inline-block w-3 h-3 rounded-full ${childColor}`} />
                                                    <Link
                                                        to={child.path}
                                                        className="underline-offset-2 hover:underline flex-1"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* Section 2: Progress details (Bug Fixes / Minor / Major)            */}
            {/* ----------------------------------------------------------------- */}
            <section className="w-full mt-12">
                <h2 className="text-2xl font-semibold mb-4">Current Goals</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Bug Fixes */}
                    <div className="border rounded-lg p-4 bg-gray-800 text-white">
                        <h3 className="font-bold mb-2">Bug Fixes</h3>
                        <ul className="list-disc list-inside space-y-1 text-left text-sm text-gray-200">
                            {progressDetails.bugFixes.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Minor Features/Updates */}
                    <div className="border rounded-lg p-4 bg-gray-800 text-white">
                        <h3 className="font-bold mb-2">Minor Features/Updates</h3>
                        <ul className="list-disc list-inside space-y-1 text-left text-sm text-gray-200">
                            {progressDetails.minorUpdates.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Major Features/Updates */}
                    <div className="border rounded-lg p-4 bg-gray-800 text-white">
                        <h3 className="font-bold mb-2">Major Features/Updates</h3>
                        <ul className="list-disc list-inside space-y-1 text-left text-sm text-gray-200">
                            {progressDetails.majorUpdates.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* Section 3: Recent Commits from GitHub                             */}
            {/* ----------------------------------------------------------------- */}
            <RecentCommits />
        </main>
    );
}

export default withLayout(SiteCompletion);
