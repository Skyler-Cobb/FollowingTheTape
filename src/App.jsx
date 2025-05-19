import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary';
import NotFound from "./pages/NotFound.jsx";

import Home from './pages/Home'

import Info from './pages/Info'
import Hints from './pages/info/Hints.jsx'
import KnowledgeBank from './pages/info/KnowledgeBank.jsx'
import Mysteries from './pages/info/Mysteries.jsx'

import Tools from "./pages/Tools.jsx";
import Decoder from './pages/tools/Decoder'
import Spectrogram from './pages/tools/Spectrogram'

import Resources from "./pages/Resources.jsx";
import Archive from './pages/resources/Archive.jsx'
import Transcripts from './pages/resources/Transcripts'
import Recordings from './pages/resources/Recordings'
import Sightings from './pages/resources/Sightings'

import Links from "./pages/Links.jsx";

import Meta from "./pages/Meta.jsx";
import AboutTheCreator from './pages/meta/AboutTheCreator'
import AboutThisSite from './pages/meta/AboutThisSite'
import SiteCompletion from './pages/meta/SiteCompletion'


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home title="Following The Tape" />} />
                <Route path="/info" element={<Info />} />
                    <Route path="/info/knowledgebank" element={<KnowledgeBank />} />
                    <Route path="/info/mysteries" element={<Mysteries />} />
                    <Route path="/info/hints" element={<Hints />} />
                <Route path="/tools" element={<Tools />} />
                    <Route path="/tools/decoder" element={<Decoder />} />
                    <Route path="/tools/spectrogram" element={ <ErrorBoundary> <Spectrogram /> </ErrorBoundary> } />
                <Route path="/resources" element={<Resources />} />
                    <Route path="/resources/archive" element={<Archive />} />
                    <Route path="/resources/transcripts" element={<Transcripts />} />
                    <Route path="/resources/recordings" element={<Recordings />} />
                    <Route path="/resources/sightings" element={<Sightings />} />
                <Route path="/links" element={<Links />} />
                <Route path="/meta" element={<Meta />} />
                    <Route path="/meta/about-the-creator" element={<AboutTheCreator />} />
                    <Route path="/meta/about-this-site" element={<AboutThisSite />} />
                    <Route path="/meta/site-completion" element={<SiteCompletion />} />
                <Route path="*" element={<NotFound title="404 – Page Not Found" />} />
            </Routes>
        </Router>
    )
}

export default App
