import React from 'react';
import withLayout from '../hoc/withLayout.jsx';
import NavIcons from "../components/NavIcons.jsx";
import AccordionCard from "../components/AccordionCard.jsx";

const PAGE_TITLE = 'Resources';

function Resources() {
    return (
        <>
            {/* page title */}
            <h1 className="mb-6 text-center text-3xl font-semibold">
                {PAGE_TITLE}
            </h1>

            {/* short intro (unchanged) */}
            <section className="mx-auto max-w-5xl space-y-5 leading-relaxed px-4">
                <p>
                    The <strong>Resources</strong> section collects data similarly to the Info section, but does so with more of a focus on helping you
                    visualize and understand the data by presenting it in alternate forms and saving old versions of uploads for reference, not just
                    presenting the facts as we know them.
                </p>
            </section>

            {/* icon grid */}
            <section className="mx-auto mt-8 mb-8 max-w-4xl px-4">
                <NavIcons basePath="/resources" />
            </section>

            {/* overview + collapsible blurbs */}
            <section className="mx-auto max-w-5xl space-y-5 leading-relaxed px-4">
                {/* overview paragraph (unchanged) */}
                <p>
                    At the moment, I've created 5 general categories of resource that I think belong here: the <strong>Archive</strong>, <strong>Transcripts</strong>,
                    <strong>Recordings</strong>, <strong>Sightings</strong>, and <strong>Site Maps</strong>. Each category is explained below.
                </p>

                {/* --- DROPDOWNS --- */}
                <AccordionCard
                    icon="/assets/nav/archive.png"
                    title="Archive"
                >
                    <p>
                        The <strong>Archive</strong> is a storage area for files that you might want to have handy to investigate, stored just in case something happens
                        to them that makes them unavailable in the future or so those who can't access them as they were put out originally can still see what they
                        are. For example, the voicemail from "Your Personal Deal Guy" is stored here, so those without the ability to call the number for one reason
                        or another can listen to it, and if the number is ever deactivated the recording is saved for posterity.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/transcripts.png"
                    title="Transcripts"
                >
                    <p>
                        The <strong>Transcripts</strong> section contains handwritten transcripts of the various videos put up as part of the ARG. It's probably the
                        single most labor-intensive resource on the site, and as such won't always be terribly up-to-date, and may contain inaccuracies as it depends
                        on my ability to make out dialogue that overlaps as multiple conversations happen concurrently, and identify characters based on their voices
                        even if they may not have been given a name yet. Still, if you'd like to have a written version of the dialogue in each video, broken up based
                        on which conversation the audio belongs to (for example, TV/radio audio is in a different column from the conversation between two people in
                        front of said TV/radio), or review specific parts of videos without having to watch them over again from the beginning, it should be helpful.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/recordings.png"
                    title="Recordings"
                >
                    <p>
                        <strong>Recordings</strong> contains any audio recordings of particular note. For now, it's just a place to listen to the voicemail from calling
                        833-NO-BRINR.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/sightings.png"
                    title="Sightings"
                >
                    <p>
                        <strong>Sightings</strong> is an especially interesting section, containing records of the different times people have had direct, individual
                        contact with in-universe characters out of the view of the public. For example, screenshots of messages sent to various people by Reaching Spaces
                        early on in the project are contained here, as well as my personal correspondence with the Haven County Library.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/sitemaps.png"
                    title="Sitemaps"
                >
                    <p>
                        Finally, the <strong>Site Maps</strong> section provides those who want a visual overview of the dialogue trees of the different in-universe
                        websites with just that. I've mapped out flowcharts of each website created so far, including the different iterations of individual sites
                        like <a href = "https://www.reachingspaces.org/" target={"_blank"}>reachingspaces.org</a>, so if you don't feel that you have time to explore each branch individually or retrace your steps repeatedly to
                        read branching paths later down in the dialogue trees, you can read it all at once right here.
                    </p>
                </AccordionCard>
            </section>
        </>
    );
}

export default withLayout(Resources);