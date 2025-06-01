// src/routes.jsx
import React from 'react';

import Home            from './pages/Home';
import NotFound        from './pages/NotFound.jsx';

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
 * `children` are nested and use **relative** paths
 *   (react‑router joins them with the parent path).
 * You can add optional keys (icon, hidden, auth) later without
 * touching router/nav code.
 */
export const routes = [
    {
        path: '/',
        label: 'Home',
        component: () => <Home title="Following The Tape" />,
    },

    {
        path: '/info',
        label: 'Info',
        component: Info,
        children: [
            { path: 'uploads',          label: 'Uploads',           component: Uploads },
            { path: 'knowledgebank',    label: 'Knowledge Bank',    component: KnowledgeBank },
            { path: 'mysteries',        label: 'Mysteries',         component: Mysteries     },
            { path: 'hints',            label: 'Hints',             component: Hints         },
        ],
    },

    {
        path: '/tools',
        label: 'Tools',
        component: Tools,
        children: [
            { path: 'decoder',      label: 'Decoder',      component: Decoder },
            {
                path: 'spectrogram',
                label: 'Spectrogram',
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
        component: Resources,
        children: [
            { path: 'archive',     label: 'Archive',     component: Archive     },
            { path: 'transcripts', label: 'Transcripts', component: Transcripts },
            { path: 'recordings',  label: 'Recordings',  component: Recordings  },
            { path: 'sightings',   label: 'Sightings',   component: Sightings   },
            { path: 'sitemaps',    label: 'Sitemaps',    component: Sitemaps   },
        ],
    },

    { path: '/links', label: 'Links', component: Links },

    {
        path: '/meta',
        label: 'Meta',
        component: Meta,
        children: [
            { path: 'about-the-creator', label: 'About the Creator', component: AboutTheCreator },
            { path: 'about-this-site',   label: 'About this Site',   component: AboutThisSite   },
            { path: 'site-completion',   label: 'Site Completion',   component: SiteCompletion  },
            { path: 'contact-me',        label: 'Contact Me',        component: ContactMe  },
            { path: 'legal',             label: 'Legal',             component: Legal   },
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
