import React from 'react';
import withLayout from '../hoc/withLayout.jsx';
import NavIcons from "../components/NavIcons.jsx";
import AccordionCard from "../components/AccordionCard.jsx";

const PAGE_TITLE = 'Tools';

function Tools() {
    return (
        <>
            {/* page title */}
            <h1 className="mb-6 text-center text-3xl font-semibold">
                {PAGE_TITLE}
            </h1>

            {/* short intro (unchanged) */}
            <section className="mx-auto max-w-5xl space-y-5 leading-relaxed px-4">
                <p>
                    The <strong>Tools</strong> section contains interactive tools that I've built to help with various aspects of the ARG.
                </p>
            </section>

            {/* icon grid */}
            <section className="mx-auto mt-8 mb-8 max-w-4xl px-4">
                <NavIcons basePath="/tools" />
            </section>

            {/* overview + collapsible blurbs */}
            <section className="mx-auto max-w-5xl space-y-5 leading-relaxed px-4">
                {/* overview paragraph (unchanged) */}
                <p>
                    At the moment, there are only a couple tools available, but that's just because there hasn't really been any need for others.
                </p>

                {/* --- DROPDOWNS --- */}
                <AccordionCard
                    icon="/assets/nav/decoder.png"
                    title="Decoder"
                >
                    <p>
                        The <strong>Decoder</strong> is a mostly-functional code translation tool that's been equipped to handle most codes that exist
                        at the present moment in the ARG, with updates coming soon for any that it can't yet. I'v also included a few other helpful
                        codes it can handle for fun, so don't assume you've missed something if you can't figure out how a specific code is relevant
                        to the ARG. It has the ability to both decode and encode messages, and can decode messages in two different ways: based on specific
                        mappings I've loaded into it via modules (things like morse code where there are consistent translations), and algorithm-based
                        translations where it uses a key that you give it to decode a message (like a Caesar Cipher where it needs to know the offset number).
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/spectrogram.png"
                    title="Spectrogram"
                >
                    <p>
                        The <strong>Spectrogram</strong> shouldn't even really be here, since as far as I know, no messages have been hidden in audio
                        so far that need a spectrogram to find, nor is there any use for a spectrogram in any puzzle that currently exists in the project.
                        That said, I've seen a large number of comments on the YouTube uploads saying that there must be some secret you need a spectrogram
                        to find, and asking people to run it through a spectrogram to see if they can find anything. So, here it is- I've added a few extra
                        settings to let you adjust the view as much as you'd like, so you can make secrets as clear as possible if they ever do end up being
                        hidden in audio. It can be a bit buggy, but overall gets the job done well.
                    </p>
                </AccordionCard>
            </section>
        </>
    );
}

export default withLayout(Tools);