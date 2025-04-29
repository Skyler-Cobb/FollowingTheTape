import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Hints from './pages/Hints'
import Decoder from './pages/tools/Decoder'
import Spectrogram from './pages/tools/Spectrogram'
import Uploads from './pages/resources/Uploads'
import Transcripts from './pages/resources/Transcripts'
import Recordings from './pages/resources/Recordings'
import Sightings from './pages/resources/Sightings'
import AboutTheCreator from './pages/meta/AboutTheCreator'
import AboutThisSite from './pages/meta/AboutThisSite'
import NotFound from "./pages/NotFound.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home title="Following The Tapes" />} />
                <Route path="/hints" element={<Hints />} />
                <Route path="/tools/decoder" element={<Decoder />} />
                <Route path="/tools/spectrogram" element={<Spectrogram />} />
                <Route path="/resources/uploads" element={<Uploads />} />
                <Route path="/resources/transcripts" element={<Transcripts />} />
                <Route path="/resources/recordings" element={<Recordings />} />
                <Route path="/resources/sightings" element={<Sightings />} />
                <Route path="/meta/about-the-creator" element={<AboutTheCreator />} />
                <Route path="/meta/about-this-site" element={<AboutThisSite />} />
                <Route path="*" element={<NotFound title="404 – Page Not Found" />} />
            </Routes>
        </Router>
    )
}

export default App
