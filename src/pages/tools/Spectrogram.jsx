// Spectrogram.jsx
import React, { useState, useRef, useEffect } from 'react';
import withLayout from '../../hoc/withLayout.jsx';

const PAGE_TITLE = 'Spectrogram Analyzer';

/* ─── tweakables ─────────────────────────────── */
const FFT_SIZE      = 2048;   // 1024‑8192
const CSS_SCROLL_PX = 2;      // visible scroll speed in *CSS* pixels
const LOG_Y         = true;   // log‑scale Y axis?
/* ─────────────────────────────────────────────── */

function Spectrogram() {
    /* state & refs */
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl,  setAudioUrl]  = useState('');

    const canvasRef   = useRef(null);
    const audioRef    = useRef(null);

    const ctxRef      = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef   = useRef(null);

    const rafRef      = useRef(null);
    const dprRef      = useRef(window.devicePixelRatio || 1);  // device‑pixel ratio

    /* create AudioContext + Analyser once */
    useEffect(() => {
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const ana  = ctx.createAnalyser();
        ana.fftSize               = FFT_SIZE;
        ana.smoothingTimeConstant = 0;

        ctxRef.current      = ctx;
        analyserRef.current = ana;

        return () => {
            if (rafRef.current)      cancelAnimationFrame(rafRef.current);
            if (sourceRef.current)   sourceRef.current.disconnect();
            ctx.close();
        };
    }, []);

    /* re‑wire when a new file is chosen */
    useEffect(() => {
        if (!audioUrl || !audioRef.current) return;

        const source = ctxRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(ctxRef.current.destination);
        sourceRef.current = source;

        /* Hi‑DPI canvas: enlarge backing store, keep CSS size */
        const canvas   = canvasRef.current;
        const dpr      = dprRef.current;
        const cssW     = canvas.offsetWidth;
        const cssH     = canvas.offsetHeight;

        canvas.width   = cssW * dpr;          // device px
        canvas.height  = cssH * dpr;
        canvas.style.width  = `${cssW}px`;    // keep physical size
        canvas.style.height = `${cssH}px`;
        canvas.getContext('2d').imageSmoothingEnabled = false; // no blurring
    }, [audioUrl]);

    /* colour helper – green‑yellow → red (like borismus’ getFullColor) */
    const ampToColor = v => {
        const hue = 62 - 62 * (v / 255);
        return `hsl(${hue},100%,50%)`;
    };

    /* main render loop – all coords in device pixels */
    const draw = () => {
        const canvas  = canvasRef.current;
        const ctx     = canvas.getContext('2d');
        const dpr     = dprRef.current;

        const widthPx  = canvas.width;    // device‑pixel geometry
        const heightPx = canvas.height;

        const scrollPx = CSS_SCROLL_PX * dpr; // how far to move & how wide to paint

        /* scroll old bitmap left */
        ctx.drawImage(canvas, -scrollPx, 0);

        /* clear the stripe that will hold new data */
        ctx.clearRect(widthPx - scrollPx, 0, scrollPx, heightPx);

        /* fetch one FFT slice */
        const bins = analyserRef.current.frequencyBinCount;
        const data = new Uint8Array(bins);
        analyserRef.current.getByteFrequencyData(data);

        /* paint right‑hand stripe */
        for (let y = 0; y < heightPx; y++) {
            const bin = LOG_Y
                ? Math.round(Math.pow(y / heightPx, 2) * (bins - 1))  // log scale
                : Math.round((y / heightPx) * (bins - 1));            // linear scale
            const val = data[bin];

            ctx.fillStyle = ampToColor(val);
            ctx.fillRect(widthPx - scrollPx, heightPx - 1 - y, scrollPx, 1);
        }

        rafRef.current = requestAnimationFrame(draw);
    };

    /* UI handlers */
    const handlePlayPause = () => {
        if (!audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            cancelAnimationFrame(rafRef.current);
        } else {
            /* user gesture resumes the AudioContext */
            ctxRef.current.resume().then(() => {
                audioRef.current.play();
                rafRef.current = requestAnimationFrame(draw);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const handleFileUpload = e => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        setIsPlaying(false);   // reset play state
    };

    /* render */
    return (
        <main className="flex min-h-[60vh] flex-col items-center gap-6 p-4">
            <h1 className="text-4xl font-bold tracking-tight">{PAGE_TITLE}</h1>

            <canvas
                ref={canvasRef}
                width="800"
                height="400"
                className="border rounded-lg bg-black w-full max-w-4xl"
            />

            <div className="flex gap-4 items-center">
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full
                     file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                    onClick={handlePlayPause}
                    disabled={!audioUrl}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-blue-600 transition-colors"
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>

            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    hidden
                />
            )}
        </main>
    );
}

export default withLayout(Spectrogram);
