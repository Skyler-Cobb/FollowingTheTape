// src/pages/Hints.jsx
import React, { useEffect } from 'react';
import withLayout from '../../hoc/withLayout.jsx';

/* ------------------------------------------------------------------
   Hints.jsx – spoiler‑controlled clues for common questions
   ------------------------------------------------------------------ */

const PAGE_TITLE = 'Hints';

const hintsData = [
    {
        question: 'How do I find the website?',
        hints: [
            'Call Mr. Pickles.',
            `Translate the hidden code in Mr. Pickles' voicemail message.`,
        ],
        solution: 'The code in the voicemail translates to reachingspaces.org',
    },
    {
        question: 'Is it possible to find the original version of the website?',
        hints: [
            `Yes. It's been archived somewhere on the site.`,
            `The location is given somewhere "behind the scenes."`,
            'Try using inspect element to look for clues.',
            'yaddayadda.html',
        ],
        solution: 'reachingspaces.org/yaddayadda.html',
    },
    {
        question: 'How can I crack this type of code? [2..3.3...4.3.5.]',
        hints: [
            'Your keyboard holds the key to the code (Assuming it’s a standard format).',
            'The dots represent movement/location.',
            'The example code in the question here says "SECRET".',
        ],
        solution:
            "Start at a number key on your keyboard. Then, go down one key for each dot. That's the letter.",
    },
];

function Hints() {
    /* friendlier tab title while on the page */
    useEffect(() => void (document.title = `${PAGE_TITLE} – Following The Tape`), []);

    return (
        <main className="flex flex-col items-center gap-8 px-4 py-8 overflow-y-auto">
            <h1 className="text-4xl font-bold tracking-tight">{PAGE_TITLE}</h1>

            <div className="w-full max-w-3xl space-y-8">
                {hintsData.map((item, qi) => (
                    <section
                        key={qi}
                        className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md"
                    >
                        <h2 className="mb-4 text-2xl font-semibold">Q: {item.question}</h2>

                        {item.hints.map((hint, hi) => (
                            <details key={hi} className="hint-detail">
                                <summary className="hint-summary">Hint {hi + 1}</summary>
                                <p className="hint-content">{hint}</p>
                            </details>
                        ))}

                        <details className="hint-detail mt-4">
                            <summary className="hint-summary">Solution</summary>
                            <p className="hint-content">{item.solution}</p>
                        </details>
                    </section>
                ))}
            </div>
        </main>
    );
}

export default withLayout(Hints);
