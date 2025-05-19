// src/pages/Home.jsx
import React from 'react';
import withLayout from '../hoc/withLayout.jsx';

function Home() {
    return (
        <>
            {/* page title */}
            <h1 className="mb-6 text-center text-3xl font-semibold">
                Following&nbsp;The&nbsp;Tape
            </h1>

            {/* two-column on large screens, stacked on mobile */}
            <section className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row">
                {/* text blurb */}
                <article className="flex-1 space-y-4 leading-relaxed">
                    <p>
                        Welcome to <strong>Following&nbsp;The&nbsp;Tape</strong>, a fan-built
                        resource built to compile and track information related to the
                        “Follow&nbsp;the&nbsp;Tape” ARG from the <em> it’s getting late… </em> YouTube channel.
                    </p>

                    <p>
                        Here you’ll find information about the arg's universe, tools, transcripts,
                        hints for those who'd like guidance but not full answers, and
                        links to other places where the mystery is being unravelled.
                    </p>

                    <p>Enjoy your stay, and don’t forget…</p>
                </article>
            </section>
        </>
    );
}

export default withLayout(Home);
