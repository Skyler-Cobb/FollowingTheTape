import React, { useEffect } from 'react';
import withLayout from '../hoc/withLayout.jsx';

/* ------------------------------------------------------------------
   Links.jsx – curated list of useful resources for the ARG
   ------------------------------------------------------------------ */

// Active, high‑value links
const primaryLinks = [
    {
        label: 'Official YouTube Channel',
        url: 'https://www.youtube.com/@followthetape',
        description: 'Source of most canon content: videos, shorts, and community posts.'
    },
    {
        label: 'Reaching Spaces Website',
        url: 'https://reachingspaces.org/',
        description: 'In‑universe microsite that sporadically updates with new hints.'
    },
    {
        label: 'Unofficial Subreddit',
        url: 'https://www.reddit.com/r/itsgettinglate/',
        description: 'Community hub for theories, transcripts, and discoveries.'
    },
    {
        label: 'Jude Brewer – “It’s Getting Late”',
        url: 'https://www.judebrewer.com/its-getting-late',
        description: 'Author’s page chronicling the project’s background.'
    },
];

// Deprecated / vanished Craigslist posts (kept for posterity)
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
    /* give the tab a friendlier title while here */
    useEffect(() => {
        document.title = 'Links – Following The Tapes';
    }, []);

    return (
        <>
            {/* page heading */}
            <h1 className="mb-8 text-center text-3xl font-semibold">
                Links
            </h1>

            {/* primary resources grid */}
            <section className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
                {primaryLinks.map(({ label, url, description }) => (
                    <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col rounded-md border border-gray-300 bg-gray-50 p-5 shadow transition-transform hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                        <h2 className="text-lg font-medium group-hover:underline">
                            {label}
                        </h2>
                        {description && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        )}
                    </a>
                ))}
            </section>

            {/* archived / hidden links */}
            <section className="mx-auto mt-10 max-w-5xl">
                <details className="rounded-md border border-gray-300 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800">
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
                                    className="text-indigo-600 hover:underline dark:text-indigo-400"
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

/* allow page to inherit global header / nav via layout HOC */
export default withLayout(Links);
