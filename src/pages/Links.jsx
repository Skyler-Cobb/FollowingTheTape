// src/pages/Links.jsx
import React, { useEffect } from 'react';
import withLayout from '../hoc/withLayout.jsx';

/* ---------------------------------------------------------------
   helper: quick favicon fetch via Google’s public service
   --------------------------------------------------------------- */
const favicon = (link) =>
    `https://www.google.com/s2/favicons?sz=64&domain=${new URL(link).hostname}`;

/* 1) real‑world resources */
const primaryLinks = [
    {
        label: 'Official YouTube Channel',
        url: 'https://www.youtube.com/@followthetape',
        description:
            'Source of most canon content: videos, shorts, and community posts.',
    },
    {
        label: 'Unofficial Subreddit',
        url: 'https://www.reddit.com/r/itsgettinglate/',
        description: 'Main community for discussing the ARG.',
    },
    {
        label: 'Jude Brewer – “It’s Getting Late”',
        url: 'https://www.judebrewer.com/its-getting-late',
        description:
            "Page on the Author's website with info on the project, including occasional glimpses at bits of future uploads.",
    },
];

/* 2) in‑universe websites */
const inUniverseSites = [
    {
        label: 'Reaching Spaces (V3)',
        url: 'https://reachingspaces.org/',
        description:
            'The site for Reaching Spaces, which sporadically updates with new/different content.',
        versions: [
            {
                label: 'V1 (Original)',
                url: 'https://reachingspaces.org/yaddayadda.html',
            },
            {
                label: "V2 (Tom's Site)",
                url: 'https://reachingspaces.org/oldtomroad.html',
            },
        ],
    },
    {
        label: 'Haven County Library',
        url: 'https://havencountylibrary.org/',
        description:
            'The Haven County Library website, now officially on the World Wide Web! ©1989',
    },
];

/* 3) archived Craigslist ads */
const craigslistLinks = [
    'https://denver.craigslist.org/hws/d/woodland-park-e-c-i-g-p-c-s/7836932125.html',
    'https://kansascity.craigslist.org/hws/d/altenburg-e-c-i-g-p-c-s/7836934555.html',
    'https://austin.craigslist.org/hws/d/quitaque-e-c-i-g-p-c-s/7836935433.html',
    'https://phoenix.craigslist.org/cph/hws/d/second-mesa-e-c-i-g-p-c-s/7836936081.html',
    'https://saltlakecity.craigslist.org/hws/d/teasdale-e-c-i-g-p-c-s/7837173928.html',
    'https://oklahomacity.craigslist.org/hws/d/muse-e-c-i-g-p-c-s/7837174683.html',
    'https://montgomery.craigslist.org/hws/d/marion-e-c-i-g-p-c-s/7837175188.html',
];

function Links() {
    useEffect(() => void (document.title = 'Links – Following The Tape'), []);

    return (
        <>
            <h1 className="mb-8 text-center text-3xl font-semibold">Links</h1>

            {/* 1) primary out‑of‑universe resources */}
            <section className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
                {primaryLinks.map(({ label, url, description }) => (
                    <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 rounded-md border border-gray-700 bg-gray-800 p-5 shadow transition-transform hover:-translate-y-1 hover:shadow-lg"
                    >
                        <img
                            src={favicon(url)}
                            alt=""
                            className="h-12 w-12 flex-none rounded"
                        />
                        <div>
                            <h2 className="text-lg font-medium group-hover:underline">
                                {label}
                            </h2>
                            {description && (
                                <p className="mt-1 text-sm text-gray-400">{description}</p>
                            )}
                        </div>
                    </a>
                ))}
            </section>

            {/* 2) in‑universe sites */}
            <section className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
                {inUniverseSites.map(({ label, url, description, versions }) => (
                    <div
                        key={url}
                        className="flex items-start gap-4 rounded-md border border-gray-700 bg-gray-800 p-5 shadow"
                    >
                        <img
                            src={favicon(url)}
                            alt=""
                            className="h-12 w-12 flex-none rounded"
                        />
                        <div className="flex flex-col">
                            <h2 className="text-lg font-medium">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {label}
                                </a>
                            </h2>
                            {description && (
                                <p className="mt-1 text-sm text-gray-400">{description}</p>
                            )}

                            {/* archived versions drop‑down */}
                            {versions?.length > 0 && (
                                <details className="mt-4 rounded border border-gray-600">
                                    <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
                                        Archived Versions
                                    </summary>
                                    <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
                                        {versions.map(({ label: vLabel, url: vUrl }) => (
                                            <li key={vUrl}>
                                                <a
                                                    href={vUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-400 hover:underline"
                                                >
                                                    {vLabel}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            {/* 3) archived Craigslist ads */}
            <section className="mx-auto mt-12 max-w-5xl">
                <details className="rounded-md border border-gray-700 bg-gray-800 p-5">
                    <summary className="cursor-pointer select-none text-lg font-medium">
                        Archived Craigslist Ads (now offline)
                    </summary>
                    <ul className="mt-4 list-disc space-y-1 pl-6 text-sm">
                        {craigslistLinks.map((url) => (
                            <li key={url} className="break-all">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:underline"
                                >
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </details>
            </section>
        </>
    );
}

export default withLayout(Links);
