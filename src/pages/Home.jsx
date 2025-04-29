// src/pages/Home.jsx
import React from 'react';
import withLayout from '../hoc/withLayout.jsx';

function Home() {
    return (
        <>
            {/* page title */}
            <h1 className="mb-6 text-center text-3xl font-semibold">
                Following&nbsp;The&nbsp;Tapes
            </h1>

            {/* two-column on large screens, stacked on mobile */}
            <section className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row">
                {/* text blurb */}
                <article className="flex-1 space-y-4 leading-relaxed">
                    <p>
                        Welcome to <strong>Following&nbsp;The&nbsp;Tapes</strong>, a community
                        resource built to compile and track information related to the
                        “Follow&nbsp;the&nbsp;Tapes” ARG (also referred to as “it’s getting
                        late…” and “reaching spaces”) from the
                        <em> it’s getting late… </em> YouTube channel.
                    </p>

                    <p>
                        Here you’ll find tools (like a decoder), handmade transcripts,
                        community-curated hints sorted by relevance and spoiler level, plus
                        links to other places where the mystery is being unravelled.
                    </p>

                    <p>Enjoy your stay, and don’t forget…</p>
                </article>

                {/* embedded video */}
                <div className="flex-1">
                    <div className="aspect-video w-full overflow-hidden rounded-md">
                        <iframe
                            src="https://www.youtube.com/embed/qInfHrXGxS4?list=PL4xmbgoceX7XOLD11-Zf27sxoSjSK0c8W"
                            title="1. the house with the strange light"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            className="h-full w-full"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default withLayout(Home);
