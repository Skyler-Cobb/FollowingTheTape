// src/routes.jsx
import React from 'react';

import NotFound        from './pages/NotFound.jsx';

import Home            from './pages/Home';
import Updates         from "./pages/home/Updates.jsx";

import Info            from './pages/Info';
import Uploads         from "./pages/info/Uploads.jsx";
import KnowledgeBank   from './pages/info/KnowledgeBank.jsx';
import Mysteries       from './pages/info/Mysteries.jsx';
import Hints           from './pages/info/Hints.jsx';

import Tools           from './pages/Tools.jsx';
import Decoder         from './pages/tools/Decoder.jsx';
import Spectrogram     from './pages/tools/Spectrogram.jsx';

import Resources       from './pages/Resources.jsx';
import Archive         from './pages/resources/Archive.jsx';
import Transcripts     from './pages/resources/Transcripts.jsx';
import Recordings      from './pages/resources/Recordings.jsx';
import Sightings       from './pages/resources/Sightings.jsx';
import Sitemaps        from './pages/resources/Sitemaps.jsx';

import Links           from './pages/Links.jsx';

import Meta            from './pages/Meta.jsx';
import AboutTheCreator from './pages/meta/AboutTheCreator.jsx';
import AboutThisSite   from './pages/meta/AboutThisSite.jsx';
import SiteCompletion  from './pages/meta/SiteCompletion.jsx';
import ContactMe       from './pages/meta/ContactMe.jsx';
import Legal           from './pages/meta/Legal.jsx';

import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Each object represents a route.
 * Optional keys (icon, hidden, auth, etc.) can be added
 * without touching router/nav code.
 */
export const routes = [
    {
        path: '/',
        label: 'Home',
        icon: '/assets/nav/home.png',
        component: Home,
        children: [
            { path: 'updates',
                label: 'Updates',
                component: Updates,
                icon: '/assets/nav/updates.png' },
        ],
    },

    {
        path: '/info',
        label: 'Info',
        icon: '/assets/nav/info.png',
        component: Info,
        children: [
            { path: 'uploads',
                label: 'Uploads',
                component: Uploads,
                icon: '/assets/nav/uploads.png' },

            { path: 'knowledgebank',
                label: 'Knowledge Bank',
                component: KnowledgeBank,
                icon: '/assets/nav/knowledge-bank.png' },

            { path: 'mysteries',
                label: 'Mysteries',
                component: Mysteries,
                icon: '/assets/nav/mysteries.png' },

            { path: 'hints',
                label: 'Hints',
                component: Hints,
                icon: '/assets/nav/hints.png' },
        ],
    },

    {
        path: '/tools',
        label: 'Tools',
        icon: '/assets/nav/tools.png',
        component: Tools,
        children: [
            { path: 'decoder',
                label: 'Decoder',
                component: Decoder,
                icon: '/assets/nav/decoder.png' },

            {
                path: 'spectrogram',
                label: 'Spectrogram',
                icon: '/assets/nav/spectrogram.png',
                component: () => (
                    <ErrorBoundary>
                        <Spectrogram />
                    </ErrorBoundary>
                ),
            },
        ],
    },

    {
        path: '/resources',
        label: 'Resources',
        icon: '/assets/nav/resources.png',
        component: Resources,
        children: [
            { path: 'archive',
                label: 'Archive',
                component: Archive,
                icon: '/assets/nav/archive.png' },

            { path: 'transcripts',
                label: 'Transcripts',
                component: Transcripts,
                icon: '/assets/nav/transcripts.png' },

            { path: 'recordings',
                label: 'Recordings',
                component: Recordings,
                icon: '/assets/nav/recordings.png' },

            { path: 'sightings',
                label: 'Sightings',
                component: Sightings,
                icon: '/assets/nav/sightings.png' },

            { path: 'sitemaps',
                label: 'Sitemaps',
                component: Sitemaps,
                icon: '/assets/nav/sitemaps.png' },
        ],
    },

    {
        path: '/links',
        label: 'Links',
        icon: '/assets/nav/links.png',
        component: Links,
    },

    {
        path: '/meta',
        label: 'Meta',
        icon: '/assets/nav/meta.png',
        component: Meta,
        children: [
            { path: 'about-the-creator',
                label: 'About the Creator',
                component: AboutTheCreator,
                icon: '/assets/nav/about-creator.png' },

            { path: 'about-this-site',
                label: 'About this Site',
                component: AboutThisSite,
                icon: '/assets/nav/about-site.png' },

            { path: 'site-completion',
                label: 'Site Completion',
                component: SiteCompletion,
                icon: '/assets/nav/site-completion.png' },

            { path: 'contact-me',
                label: 'Contact Me',
                component: ContactMe,
                icon: '/assets/nav/contact-me.png' },

            { path: 'legal',
                label: 'Legal',
                component: Legal,
                icon: '/assets/nav/legal.png' },
        ],
    },

    // Catch‑all 404 (hidden from nav)
    {
        path: '*',
        label: '404',
        component: () => <NotFound title="404 – Page Not Found" />,
        hidden: true,
    },
];
