// src/pages/Info.jsx
import React from 'react';
import withLayout from '../hoc/withLayout.jsx';
import NavIcons from '../components/NavIcons.jsx';
import AccordionCard from '../components/AccordionCard.jsx';

const PAGE_TITLE = 'Info';

function Info() {
    return (
        <>
            {/* page title */}
            <h1 className="mb-6 text-center text-3xl font-semibold">
                {PAGE_TITLE}
            </h1>

            {/* short intro (unchanged) */}
            <section className="mx-auto max-w-5xl space-y-5 leading-relaxed px-4">
                <p>
                    The <strong>Info</strong> section collects, as the name suggests, information regarding what we've discovered so far.
                </p>
            </section>

            {/* icon grid */}
            <section className="mx-auto mt-8 mb-8 max-w-4xl px-4">
                <NavIcons basePath="/info" />
            </section>

            {/* overview + collapsible blurbs */}
            <section className="mx-auto max-w-5xl space-y-5 leading-relaxed px-4">
                {/* overview paragraph (unchanged) */}
                <p>
                    Specifically, it groups information into 4 main categories: <strong>Uploads</strong>, the <strong>Knowledge Bank</strong>,
                    <strong> Mysteries</strong>, and <strong>Hints</strong>. Below are more in-depth descriptions of what each of these
                    categories are.
                </p>

                {/* --- DROPDOWNS --- */}
                <AccordionCard
                    icon="/assets/nav/uploads.png"
                    title="Uploads"
                >
                    <p>
                        <strong>Uploads</strong> contains a list of all uploads that have gone up in an official context for the project's audience to see.
                        That means videos, YT shorts, community posts, websites, and anything else that can be or could be viewed by everybody at some
                        point in time. Some information has been sent to specific participants, and is not stored in the Uploads data.
                        The communications that have been made known are stored in "Sightings" under the Resources section of this site.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/knowledge-bank.png"
                    title="Knowledge Bank"
                >
                    <p>
                        The <strong>Knowledge Bank</strong> is the closest thing we have to a Wiki. In it, I've stored as much information as
                        I can on different things from within the world of the ARG, such as characters, organizations, locations, phenomena, concepts,
                        themes, puzzles, and the different uploads. It should update regularly to stay as up-to-date as possible, but if you discover
                        that something isn't right, please reach out to let me know so I can correct/amend the entry.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/mysteries.png"
                    title="Mysteries"
                >
                    <p>
                        <strong>Mysteries</strong> are what I believe to be the biggest unsolved questions of the project. I try to track any odd
                        holes in our known information here (e.g. "What was the deal with that shampoo video?"), as well as more blatant mysteries
                        we have yet to solve (e.g. "What is the answer to the Midnight Riddle?"). Ideally, this will help those visiting this site
                        keep track of the many things we need to consider as we try to unravel the story of <i>Follow the Tape</i>.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/hints.png"
                    title="Hints"
                >
                    <p>
                        The <strong>Hints</strong> section is meant to be a way to help those who haven't been actively following things as
                        the community discusses them and don't want to look up answers, but still find themselves stuck on something and could use some
                        indirect help. I've tried to compile hints regarding things that I think people may be most likely to need help with, and created
                        a list of progressively more helpful pointers under each one so people can only get the amount of assistance that they feel they
                        need, no more, no less.
                    </p>
                </AccordionCard>
            </section>
        </>
    );
}

export default withLayout(Info);
