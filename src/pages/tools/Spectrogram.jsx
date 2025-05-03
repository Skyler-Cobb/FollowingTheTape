// Spectrogram.jsx – responsive scrolling spectrogram
import React, { useState, useRef, useEffect } from 'react';
import withLayout from '../../hoc/withLayout.jsx';

/* ── title ───────────────────────── */
const PAGE_TITLE = 'Spectrogram';

/* ── analyser & defaults ─────────── */
const FFT_SIZE       = 2048;
const MIN_DB         = -100;
const MAX_DB         = -30;

const DEFAULT_GAMMA  = 1.3;
const DEFAULT_SCROLL = 1;
const DEFAULT_WIN_S  = 10;    // seconds visible
/* ────────────────────────────────── */

function Spectrogram() {
    /* —— state —— */
    const [audioUrl,  setAudioUrl]  = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    const [gamma,     setGamma]     = useState(DEFAULT_GAMMA);
    const [scrollF,   setScrollF]   = useState(DEFAULT_SCROLL);
    const [winSec,    setWinSec]    = useState(DEFAULT_WIN_S);
    const [playRate,  setPlayRate]  = useState(1);

    const [logScale,  setLogScale]  = useState(false);   // default = linear

    const [curTime,   setCurTime]   = useState(0);
    const [duration,  setDuration]  = useState(0);

    /* —— refs visible in draw() —— */
    const gRef   = useRef(gamma);
    const sRef   = useRef(scrollF);
    const wRef   = useRef(winSec);
    const logRef = useRef(logScale);
    const playR  = useRef(isPlaying);

    /* —— DOM & audio graph —— */
    const canvasRef = useRef(null);
    const audioRef  = useRef(null);

    const ctxRef    = useRef(null);   // AudioContext
    const anaRef    = useRef(null);
    const srcRef    = useRef(null);

    const rafRef    = useRef(null);
    const lastTS    = useRef(null);
    const dpr       = useRef(window.devicePixelRatio || 1);

    /* —— keep refs in sync —— */
    useEffect(() => { gRef.current   = gamma;     }, [gamma]);
    useEffect(() => { sRef.current   = scrollF;   }, [scrollF]);
    useEffect(() => { wRef.current   = winSec;    }, [winSec]);
    useEffect(() => { logRef.current = logScale;  }, [logScale]);
    useEffect(() => { playR.current  = isPlaying; }, [isPlaying]);

    /* —— create AudioContext once —— */
    useEffect(() => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const an  = ctx.createAnalyser();
        an.fftSize               = FFT_SIZE;
        an.smoothingTimeConstant = 0;
        an.minDecibels           = MIN_DB;
        an.maxDecibels           = MAX_DB;

        ctxRef.current = ctx;
        anaRef.current = an;

        return () => { ctx.close(); };
    }, []);

    /* —— reconnect graph & size canvas on file load —— */
    useEffect(() => {
        if (!audioUrl || !audioRef.current) return;

        const src = ctxRef.current.createMediaElementSource(audioRef.current);
        src.connect(anaRef.current);
        anaRef.current.connect(ctxRef.current.destination);
        srcRef.current = src;

        const c = canvasRef.current;
        const resize = () => {
            const cssW = c.offsetWidth, cssH = c.offsetHeight;
            c.width  = cssW * dpr.current;
            c.height = cssH * dpr.current;
            c.style.width  = `${cssW}px`;
            c.style.height = `${cssH}px`;
            c.getContext('2d').imageSmoothingEnabled = false;
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [audioUrl]);

    /* —— sync playback‑rate —— */
    useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playRate; },
        [playRate]);

    /* —— keep curTime / duration —— */
    useEffect(() => {
        if (!audioRef.current) return;
        const a = audioRef.current;
        const t = () => setCurTime(a.currentTime);
        const d = () => setDuration(a.duration ?? 0);
        a.addEventListener('timeupdate', t);
        a.addEventListener('durationchange', d);
        return () => { a.removeEventListener('timeupdate', t);
            a.removeEventListener('durationchange', d); };
    }, [audioUrl]);

    /* —— colour map: deep red tops —— */
    const ampToColor = v => {
        const n = Math.pow(v / 255, gRef.current);
        if (n < 0.02) return 'hsl(0,0%,0%)';          // silence
        const hue   = 60 - 60 * n;                    // 60° → 0°
        const light = 12 + 28 * n;                    // 12 % → 40 %  (deeper red)
        return `hsl(${hue},100%,${light}%)`;
    };

    /* —— draw loop —— */
    const draw = ts => {
        const c   = canvasRef.current;
        const ctx = c.getContext('2d');

        const prev = lastTS.current ?? ts;
        const dt   = ts - prev;
        lastTS.current = ts;

        const base = (dt / 1000) * (c.width / wRef.current);
        const step = Math.max(1, Math.round(base * sRef.current));

        ctx.drawImage(c, -step, 0);
        ctx.clearRect(c.width - step, 0, step, c.height);

        const bins = anaRef.current.frequencyBinCount;
        const data = new Uint8Array(bins);
        anaRef.current.getByteFrequencyData(data);

        for (let y = 0; y < c.height; y++) {
            const bin = logRef.current
                ? Math.round(Math.pow(y / c.height, 2) * (bins - 1))
                : Math.round((y / c.height) * (bins - 1));
            ctx.fillStyle = ampToColor(data[bin]);
            ctx.fillRect(c.width - step, c.height - 1 - y, step, 1);
        }

        if (playR.current) rafRef.current = requestAnimationFrame(draw);
    };

    /* —— handlers —— */
    const playPause = () => {
        if (!audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        } else {
            ctxRef.current.resume().then(() => {
                audioRef.current.play();
                lastTS.current = null;
                rafRef.current = requestAnimationFrame(draw);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const loadFile = e => {
        const f = e.target.files[0];
        if (!f) return;
        setAudioUrl(URL.createObjectURL(f));
        setIsPlaying(false);
        setCurTime(0); setDuration(0);
        /* clear canvas when new file picked */
        const c = canvasRef.current;
        c && c.getContext('2d').clearRect(0,0,c.width,c.height);
    };

    const scrub = e => {
        if (!audioRef.current) return;
        const t = +e.target.value;
        audioRef.current.currentTime = t;
        setCurTime(t);
    };

    /* clear + refresh canvas when window length changes */
    useEffect(() => {
        const c = canvasRef.current;
        c && c.getContext('2d').clearRect(0,0,c.width,c.height);
    }, [winSec]);

    /* —— UI —— */
    return (
        <main className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">{PAGE_TITLE}</h1>

            <canvas
                ref={canvasRef}
                className="border rounded-lg bg-black w-full h-[40vh] max-h-[500px]"
            />

            <section className="flex flex-col gap-4">
                {duration > 0 && (
                    <input type="range" min="0" max={duration} step="0.01"
                           value={curTime} onChange={scrub} className="w-full" />
                )}

                <div className="flex items-center gap-3">
                    <input type="file" accept="audio/*" onChange={loadFile}
                           className="file:mr-3 file:py-1.5 file:px-3 file:rounded-full
                            file:border-0 file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    <button onClick={playPause} disabled={!audioUrl}
                            className="px-5 py-2 bg-blue-500 text-white rounded-full
                             disabled:opacity-50 hover:bg-blue-600">
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex flex-col">
                        Gamma {gamma.toFixed(2)}
                        <input type="range" min="0.2" max="3" step="0.05"
                               value={gamma} onChange={e => setGamma(+e.target.value)} />
                    </label>

                    <label className="flex flex-col">
                        Playback {playRate.toFixed(2)}×
                        <input type="range" min="0.25" max="2" step="0.05"
                               value={playRate} onChange={e => setPlayRate(+e.target.value)} />
                    </label>

                    <label className="flex flex-col">
                        Scroll {scrollF.toFixed(2)}×
                        <input type="range" min="0.25" max="3" step="0.25"
                               value={scrollF} onChange={e => setScrollF(+e.target.value)} />
                    </label>

                    <label className="flex flex-col">
                        Window {winSec}s
                        <input type="range" min="5" max="30" step="1"
                               value={winSec} onChange={e => setWinSec(+e.target.value)} />
                    </label>

                    <label className="flex items-center gap-2 col-span-full">
                        <input type="checkbox" checked={logScale}
                               onChange={e => setLogScale(e.target.checked)} />
                        Logarithmic Y Scale
                    </label>
                </div>
            </section>

            {audioUrl && (
                <audio ref={audioRef} src={audioUrl}
                       onEnded={() => setIsPlaying(false)} hidden />
            )}
        </main>
    );
}

Spectrogram.layoutOpts = { fullWidth: true };
export default withLayout(Spectrogram);
