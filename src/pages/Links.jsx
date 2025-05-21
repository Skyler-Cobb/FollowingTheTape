// src/pages/Links.jsx
import React, { useEffect } from 'react';
import withLayout from '../hoc/withLayout.jsx';

/* ------------------------------------------------------------------
   Links.jsx – curated list of useful resources for the ARG
   ------------------------------------------------------------------ */

const primaryLinks = [
    {
        label: 'Official YouTube Channel',
        url: 'https://www.youtube.com/@followthetape',
        description: 'Source of most canon content: videos, shorts, and community posts.',
    },
    {
        label: 'Reaching Spaces Website',
        url: 'https://reachingspaces.org/',
        description: 'In‑universe site that sporadically updates with new content.',
    },
    {
        label: 'Unofficial Subreddit',
        url: 'https://www.reddit.com/r/itsgettinglate/',
        description: 'Main community for discussing the ARG.',
    },
    {
        label: 'Jude Brewer – “It’s Getting Late”',
        url: 'https://www.judebrewer.com/its-getting-late',
        description: 'Author’s page with info on the project.',
    },
];

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

            {/* primary resources */}
            <section className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
                {primaryLinks.map(({ label, url, description }) => (
                    <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col rounded-md border border-gray-700 bg-gray-800 p-5 shadow transition-transform hover:-translate-y-1 hover:shadow-lg"
                    >
                        <h2 className="text-lg font-medium group-hover:underline">{label}</h2>
                        {description && (
                            <p className="mt-1 text-sm text-gray-400">{description}</p>
                        )}
                    </a>
                ))}
            </section>

            {/* archived / hidden links */}
            <section className="mx-auto mt-10 max-w-5xl">
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
