import React from 'react';
import withLayout from '../hoc/withLayout.jsx';
import NavIcons from "../components/NavIcons.jsx";
import AccordionCard from "../components/AccordionCard.jsx";

const PAGE_TITLE = 'Meta';

function Meta() {
    return (
        <>
            {/* page title */}
            <h1 className="mb-6 text-center text-3xl font-semibold">
                {PAGE_TITLE}
            </h1>

            {/* short intro (unchanged) */}
            <section className="mx-auto max-w-5xl space-y-5 leading-relaxed px-4">
                <p>
                    The <strong>Meta</strong> section is where you can find information that's outside the scope of the actual ARG.
                </p>
            </section>

            {/* icon grid */}
            <section className="mx-auto mt-8 mb-8 max-w-4xl px-4">
                <NavIcons basePath="/meta" />
            </section>

            {/* overview + collapsible blurbs */}
            <section className="mx-auto max-w-5xl space-y-5 leading-relaxed px-4">
                {/* overview paragraph (unchanged) */}
                <p>
                    I've decided on a few sections that I thought might deserve special attention and put them here: About the Creator,
                    About this SIte, Site Completion, Contact Me, and Legal.
                </p>

                {/* --- DROPDOWNS --- */}
                <AccordionCard
                    icon="/assets/nav/about-creator.png"
                    title="About the Creator"
                >
                    <p>
                        <strong>About the Creator</strong> is a section meant to help give credit to the (only currently known) author of the
                        project, Jude Brewer, for his incredible work. It contains a brief write-up on him, but if you're looking for more information,
                        please <a href = "https://www.judebrewer.com/" target={"_blank"}>visit his website</a>.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/about-site.png"
                    title="About This Site"
                >
                    <p>
                        <strong>About This Site</strong> is where you can find me talk about myself a bit and why I made this website. If you're
                        interested in that sort of thing, or how the website was made (certainly not the optimal way, that's for sure), you should
                        pay it a visit.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/site-completion.png"
                    title="Site Completion"
                >
                    <p>
                        <strong>Site Completion</strong> contains a map of this website, and marks every page based on how close it is to completion.
                        If you're trying to figure out what there is to do here but running into dead ends, give it a look! It also contains information
                        like planned upcoming features, and a list of recent commits (updates) made to <a href = "https://github.com/Skyler-Cobb/FollowingTheTape" target={"_blank"}>the project on GitHub</a> if
                        you're interested in where things are going, or how active I've been.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/contact-me.png"
                    title="Contact Me"
                >
                    <p>
                        On the<strong>Contact Me</strong> page, you can do exactly that- contact me. I'm not sure exactly how much you should expect me
                        to be checking my inbox for messages from users, since I'm not expecting many at all, but feel free to shoot me a message
                        if you've got something you'd like to say.
                    </p>
                </AccordionCard>

                <AccordionCard
                    icon="/assets/nav/legal.png"
                    title="Legal"
                >
                    <p>
                        Finally, the <strong>Legal</strong> section is... a bit weird to even include, honestly. My understanding is that most websites
                        this small really, really don't need that stuff 99.9% of the time, but unfortunately, I'm a massively curious person, so I added
                        Google Analytics to the site so I could see if anybody was actually visiting, and if so, what they care about. That means adding
                        a single cookie to the website, which suddenly means that there are quite a few laws in quite a few countries that I might be breaking if
                        I don't tread carefully. So that's my "please don't sue me I swear I'm a good person" section. Debatable whether or not it's worth the
                        ability to check my analytics data, but what's done is done.
                    </p>
                </AccordionCard>
            </section>
        </>
    );
}

export default withLayout(Meta);