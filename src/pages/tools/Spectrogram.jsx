// src/pages/tools/Spectrogram.jsx
import React, { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.esm.js'
import withLayout from '../../hoc/withLayout.jsx'

export default withLayout(Spectrogram)

/** clamp x into [min, max] */
const clamp = (x, min, max) => (x < min ? min : x > max ? max : x)

function Spectrogram() {
    const wsRef = useRef(null)
    const containerRef = useRef(null)
    const spectroRef = useRef(null)
    const playHeadRef = useRef(null)
    const pxPerSecRef = useRef(0)

    const [fileName, setFileName] = useState('')
    const [isReady, setIsReady] = useState(false)
    const [duration, setDuration] = useState(0)
    const [scale, setScale] = useState('linear')
    const [zoomWindow, setZoomWindow] = useState(0)
    const [focusTime, setFocusTime] = useState(0)

    /** Initialize WaveSurfer */
    useEffect(() => {
        const ws = WaveSurfer.create({
            container: containerRef.current,
            height: 256,
            interact: true,
            responsive: true,
            plugins: [
                SpectrogramPlugin.create({
                    container: spectroRef.current,
                    labels: true,
                    frequencyScale: scale,
                    fftSamples: 1024,
                }),
            ],
        })
        wsRef.current = ws

        ws.on('ready', () => {
            const d = ws.getDuration()
            setDuration(d)
            setIsReady(true)
            // reset viewport
            setZoomWindow(0)
            setFocusTime(0)
        })

        ws.on('timeupdate', (time) => {
            // move play head
            if (playHeadRef.current && duration > 0) {
                playHeadRef.current.style.left = `${(time / duration) * 100}%`
            }
            // auto-pan if zoomed
            if (zoomWindow > 0 && pxPerSecRef.current > 0) {
                const half = zoomWindow / 2
                const center = clamp(time, half, duration - half)
                const start = center - half
                containerRef.current.scrollLeft = start * pxPerSecRef.current
            }
        })

        return () => ws.destroy()
    }, [scale, duration, zoomWindow])

    /** Handle file upload */
    const onFile = (e) => {
        const file = e.target.files?.[0]
        if (!file || !wsRef.current) return
        wsRef.current.load(URL.createObjectURL(file))
        setFileName(file.name)
    }

    /** Recompute zoom whenever zoomWindow or focusTime changes */
    useEffect(() => {
        if (!isReady || !wsRef.current) return

        const width = containerRef.current.clientWidth
        if (width <= 0) return

        if (zoomWindow > 0) {
            // clamp inputs
            const zw = clamp(zoomWindow, 0, duration)
            setZoomWindow(zw)

            // pixels per second
            const pxpsec = width / zw
            pxPerSecRef.current = pxpsec
            wsRef.current.zoom(pxpsec)

            // initial scroll based on focusTime
            const half = zw / 2
            const ft = clamp(focusTime, half, duration - half)
            setFocusTime(ft)
            const start = ft - half
            containerRef.current.scrollLeft = start * pxpsec
        } else {
            // full+fit
            pxPerSecRef.current = 0
            wsRef.current.zoom(0)
            containerRef.current.scrollLeft = 0
        }
    }, [zoomWindow, focusTime, isReady, duration])

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-semibold">Interactive Spectrogram</h1>

            {/* File picker */}
            <label className="inline-block cursor-pointer rounded bg-gray-800 px-4 py-2 hover:bg-gray-700">
                Choose audio/video…
                <input type="file" accept="audio/*,video/*" className="hidden" onChange={onFile} />
            </label>
            {fileName && <p className="text-sm text-gray-400">Loaded: {fileName}</p>}

            {/* Controls */}
            {isReady && (
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        className="rounded bg-gray-700 px-4 py-1 hover:bg-gray-600"
                        onClick={() => wsRef.current.playPause()}
                    >
                        ▶/⏸
                    </button>

                    <label className="flex items-center gap-2">
                        Scale:
                        <select
                            className="rounded bg-gray-700 p-1"
                            value={scale}
                            onChange={(e) => setScale(e.target.value)}
                        >
                            <option value="linear">Linear</option>
                            <option value="log">Log</option>
                        </select>
                    </label>

                    <label className="flex items-center gap-2">
                        Window (s):
                        <input
                            type="number"
                            className="w-16 rounded bg-gray-700 p-1 text-right"
                            min={0}
                            max={duration}
                            step={0.5}
                            value={zoomWindow}
                            onChange={(e) => setZoomWindow(Number(e.target.value))}
                        />
                    </label>

                    <label className="flex items-center gap-2">
                        Focus @ (s):
                        <input
                            type="number"
                            className="w-20 rounded bg-gray-700 p-1 text-right"
                            min={0}
                            max={duration}
                            step={0.1}
                            value={focusTime}
                            onChange={(e) => setFocusTime(Number(e.target.value))}
                        />
                    </label>
                </div>
            )}

            {/* Spectrogram */}
            <div
                ref={containerRef}
                className="relative overflow-x-auto overflow-y-hidden border border-gray-700"
            >
                <div
                    ref={playHeadRef}
                    className="absolute top-0 bottom-0 w-px bg-red-500 pointer-events-none"
                />
                <div ref={spectroRef} />
            </div>
        </section>
    )
}

Spectrogram.layoutOpts = { fullWidth: true }
