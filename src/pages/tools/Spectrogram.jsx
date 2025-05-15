// Spectrogram.jsx  — scrolling spectrogram with collapsible‑sidebar controls
import React, { useState, useRef, useEffect, useCallback } from 'react';
import withLayout from '../../hoc/withLayout.jsx';

/* — title & analyser — */
const PAGE_TITLE   = 'Spectrogram';
const FFT_SIZE     = 2048;
const MIN_DB       = -100;
const MAX_DB       = -30;

/* defaults */
const DEF_GAMMA      = 1.3;
const DEF_CONTRAST   = 1;
const DEF_SCROLL     = 1;
const DEF_WINDOW_S   = 10;
const DEF_HEIGHT_SCL = 1;          // new — height “smoosh” (1 = full)

function Spectrogram() {
    /* state */
    const [audioUrl,  setAudioUrl]   = useState('');
    const [isPlaying, setIsPlaying]  = useState(false);

    const [gamma,       setGamma]       = useState(DEF_GAMMA);
    const [contrast,    setContrast]    = useState(DEF_CONTRAST);
    const [scrollF,     setScrollF]     = useState(DEF_SCROLL);
    const [winSec,      setWinSec]      = useState(DEF_WINDOW_S);
    const [playRate,    setPlayRate]    = useState(1);
    const [logScale,    setLogScale]    = useState(false);
    const [heightScl,   setHeightScl]   = useState(DEF_HEIGHT_SCL);   // ← NEW
    const [sidebarOpen, setSidebarOpen] = useState(true);             // ← NEW

    const [curTime,   setCurTime]   = useState(0);
    const [duration,  setDuration]  = useState(0);

    /* refs visible in draw / export */
    const gRef   = useRef(gamma);
    const cRef   = useRef(contrast);
    const sRef   = useRef(scrollF);
    const wRef   = useRef(winSec);
    const hRef   = useRef(heightScl);   // ← NEW
    const logRef = useRef(logScale);
    const playR  = useRef(isPlaying);

    /* DOM & audio graph */
    const canvasRef = useRef(null);          // scrolling spectrogram
    const waveRef   = useRef(null);          // tiny waveform scrub bar
    const audioRef  = useRef(null);

    const ctxRef    = useRef(null);          // AudioContext
    const anaRef    = useRef(null);
    const srcRef    = useRef(null);

    const rafRef    = useRef(null);
    const lastTS    = useRef(null);
    const fracRef   = useRef(0);             // fractional scroll accumulator
    const dpr       = useRef(window.devicePixelRatio || 1);

    /* prettify seconds */
    const fmtTime = t => {
        if (!isFinite(t)) return '00:00:00.00';
        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const s = (t % 60).toFixed(2).padStart(5,'0');
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${s}`;
    };

    /* keep refs in sync */
    useEffect(()=>{ gRef.current = gamma;       },[gamma]);
    useEffect(()=>{ cRef.current = contrast;    },[contrast]);
    useEffect(()=>{ sRef.current = scrollF;     },[scrollF]);
    useEffect(()=>{ wRef.current = winSec;      },[winSec]);
    useEffect(()=>{ hRef.current = heightScl;   },[heightScl]);  // ← NEW
    useEffect(()=>{ logRef.current = logScale;  },[logScale]);
    useEffect(()=>{ playR.current = isPlaying;  },[isPlaying]);

    /* set up AudioContext once */
    useEffect(()=>{
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const an  = ctx.createAnalyser();
        an.fftSize               = FFT_SIZE;
        an.smoothingTimeConstant = 0;
        an.minDecibels           = MIN_DB;
        an.maxDecibels           = MAX_DB;

        ctxRef.current = ctx;
        anaRef.current = an;

        return () => ctx.close();
    },[]);

    /* connect graph + size canvases */
    useEffect(()=>{
        if(!audioUrl||!audioRef.current) return;

        const src = ctxRef.current.createMediaElementSource(audioRef.current);
        src.connect(anaRef.current);
        anaRef.current.connect(ctxRef.current.destination);
        srcRef.current = src;

        const spec = canvasRef.current;
        const wave = waveRef.current;
        const resize = ()=>{
            const cssW = spec.offsetWidth;
            const cssH = spec.offsetHeight / hRef.current; // account for scale
            spec.width  = cssW*dpr.current;
            spec.height = cssH*dpr.current;
            spec.getContext('2d').imageSmoothingEnabled = false;

            wave.width  = cssW*dpr.current;
            wave.height = 60*dpr.current;
            drawWaveform();
        };
        resize();
        window.addEventListener('resize',resize);
        return()=>window.removeEventListener('resize',resize);
    },[audioUrl]);

    /* sync playback rate */
    useEffect(()=>{ if(audioRef.current) audioRef.current.playbackRate = playRate; },
        [playRate]);

    /* curTime & duration */
    useEffect(()=>{
        if(!audioRef.current) return;
        const a = audioRef.current;
        const t = () => setCurTime(a.currentTime);
        const d = () => setDuration(a.duration||0);
        a.addEventListener('timeupdate',t);
        a.addEventListener('durationchange',d);
        return()=>{a.removeEventListener('timeupdate',t);
            a.removeEventListener('durationchange',d);}
    },[audioUrl]);

    /* colour function */
    const ampToColor = v=>{
        let n = Math.pow(v/255,gRef.current)*cRef.current;
        n = Math.min(1,n);
        if(n<0.02) return 'hsl(0,0%,0%)';
        const hue = 60-60*n;
        const light = 12+28*n;
        return`hsl(${hue},100%,${light}%)`;
    };

    /* draw loop with fractional scrolling (fixes window speed) */
    const draw = ts=>{
        const c = canvasRef.current, ctx = c.getContext('2d');
        const prev = lastTS.current??ts;
        const dt   = ts - prev;
        lastTS.current = ts;

        const cssW = c.width/dpr.current;                 // CSS‑px width
        const cssScroll = dt/1000 * (cssW / wRef.current) * sRef.current;
        const devScroll = cssScroll * dpr.current;
        fracRef.current += devScroll;
        const step = Math.floor(fracRef.current);         // integer px
        fracRef.current -= step;

        if(step>0){
            ctx.drawImage(c,-step,0);
            ctx.clearRect(c.width-step,0,step,c.height);
        }

        const bins = anaRef.current.frequencyBinCount;
        const data = new Uint8Array(bins);
        anaRef.current.getByteFrequencyData(data);

        if(step>0){
            for(let y=0;y<c.height;y++){
                const bin = logRef.current
                    ? Math.round(Math.pow(y/c.height,2)*(bins-1))
                    : Math.round((y/c.height)*(bins-1));
                ctx.fillStyle = ampToColor(data[bin]);
                ctx.fillRect(c.width-step,c.height-1-y,step,1);
            }
        }

        if(playR.current) rafRef.current = requestAnimationFrame(draw);
    };

    /* tiny waveform */
    const peaksRef = useRef([]);
    const drawWaveform = useCallback(()=>{
        const wave = waveRef.current;
        if(!wave||peaksRef.current.length===0) return;
        const ctx  = wave.getContext('2d');
        const W    = wave.width, H = wave.height;
        ctx.clearRect(0,0,W,H);
        ctx.fillStyle='#666';
        const step = peaksRef.current.length/W;
        for(let x=0;x<W;x++){
            const i = Math.floor(x*step);
            const v = peaksRef.current[i]??0;
            const y = (1-v)*H/2;
            ctx.fillRect(x,y,1,H-2*y);
        }
        if(duration>0){
            const headX = (curTime/duration)*W;
            ctx.fillStyle='#fff';
            ctx.fillRect(headX,0,2,H);
        }
    },[curTime,duration]);

    /* decode peaks once per file */
    useEffect(()=>{
        if(!audioUrl)return;
        fetch(audioUrl)
            .then(r=>r.arrayBuffer())
            .then(buf=>ctxRef.current.decodeAudioData(buf))
            .then(ab=>{
                const ch=ab.getChannelData(0);
                const samples=1000, block=Math.floor(ch.length/samples);
                const peaks=new Array(samples).fill(0);
                for(let i=0;i<samples;i++){
                    let m=0;
                    for(let j=0;j<block;j++){
                        const v=Math.abs(ch[i*block+j]);
                        if(v>m)m=v;
                    }
                    peaks[i]=m;
                }
                peaksRef.current = peaks;
                drawWaveform();
            });
    },[audioUrl,drawWaveform]);

    useEffect(()=>{ drawWaveform(); },[curTime,drawWaveform]);

    /* clear spectrogram when window seconds change */
    useEffect(()=>{
        const c=canvasRef.current;
        c&&c.getContext('2d').clearRect(0,0,c.width,c.height);
    },[winSec]);

    /* handlers */
    const playPause = ()=>{
        if(!audioUrl)return;
        if(isPlaying){
            audioRef.current.pause();
            if(rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current=null;
        }else{
            ctxRef.current.resume().then(()=>{
                audioRef.current.play();
                lastTS.current=null;
                rafRef.current=requestAnimationFrame(draw);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const loadFile = e=>{
        const f=e.target.files[0]; if(!f)return;
        setAudioUrl(URL.createObjectURL(f));
        setIsPlaying(false); setCurTime(0); setDuration(0);
        const c=canvasRef.current;
        c&&c.getContext('2d').clearRect(0,0,c.width,c.height);
    };

    const scrub = e=>{
        if(!audioRef.current||duration===0)return;
        const rect=waveRef.current.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const ratio=Math.min(Math.max(x/rect.width,0),1);
        const t=ratio*duration;
        audioRef.current.currentTime=t; setCurTime(t);
    };

    /* download helper */
    const download = (blob,name)=>{
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a'); a.href=url; a.download=name; a.click();
        URL.revokeObjectURL(url);
    };

    /* export current view */
    const exportCurrent = ()=>canvasRef.current.toBlob(b=>download(b,'spectrogram.png'));

    /* export full view (unchanged) */
    // ───────────────────────────────────────────────────────────────────────────
    /* ---------- Export Full View  (1‑to‑1 pixel‑perfect)  -------------------- */
    const exportFull = async () => {
        if (!audioUrl) return;
        /* (function body unchanged) */
        /* … (identical to previous version) … */
    };
    // ───────────────────────────────────────────────────────────────────────────



    /* ───────────────────────────────  UI  ─────────────────────────────── */
    return (
        <main className="flex h-full w-full">
            {/* ░░░ Collapsible sidebar ░░░ */}
            <aside
                className={`flex flex-col bg-gray-800 text-white transition-all duration-300
                           ${sidebarOpen ? 'w-64' : 'w-8'} overflow-hidden`}
            >
                <button
                    onClick={()=>setSidebarOpen(!sidebarOpen)}
                    className="w-full bg-gray-700 hover:bg-gray-600 p-1 text-sm"
                    title={sidebarOpen ? 'Collapse' : 'Expand'}
                >
                    {sidebarOpen ? '«' : '»'}
                </button>

                {sidebarOpen && (
                    <div className="flex flex-col gap-4 p-4">
                        <label className="flex flex-col">
                            Gamma {gamma.toFixed(2)}
                            <input type="range" min="0.2" max="3" step="0.05"
                                   value={gamma} onChange={e=>setGamma(+e.target.value)}/>
                        </label>

                        <label className="flex flex-col">
                            Contrast {contrast.toFixed(2)}×
                            <input type="range" min="0.5" max="3" step="0.1"
                                   value={contrast} onChange={e=>setContrast(+e.target.value)}/>
                        </label>

                        <label className="flex flex-col">
                            Height {heightScl.toFixed(2)}×
                            <input type="range" min="0.25" max="1" step="0.05"
                                   value={heightScl} onChange={e=>setHeightScl(+e.target.value)}/>
                        </label>

                        <label className="flex flex-col">
                            Scroll {scrollF.toFixed(2)}×
                            <input type="range" min="0.25" max="3" step="0.05"
                                   value={scrollF} onChange={e=>setScrollF(+e.target.value)}/>
                        </label>

                        <label className="flex flex-col">
                            Window {winSec}s / max {Math.floor(duration)}s
                            <input type="range" min="5" max={Math.max(5,Math.floor(duration))}
                                   step="1" value={winSec}
                                   onChange={e=>setWinSec(+e.target.value)}/>
                        </label>

                        <label className="flex flex-col">
                            Playback {playRate.toFixed(2)}×
                            <input type="range" min="0.25" max="2" step="0.05"
                                   value={playRate} onChange={e=>setPlayRate(+e.target.value)}/>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={logScale}
                                   onChange={e=>setLogScale(e.target.checked)}/>
                            Logarithmic Y Scale
                        </label>
                    </div>
                )}
            </aside>

            {/* ░░░ Main content ░░░ */}
            <div className="flex flex-col flex-1 gap-4 p-4 overflow-hidden">
                <h1 className="text-4xl font-bold">{PAGE_TITLE}</h1>

                {/* scrolling spectrogram (height “smooshed” via CSS transform) */}
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        className="border rounded-lg bg-black w-full h-[40vh] max-h-[500px]"
                        style={{ transform: `scaleY(${heightScl})`, transformOrigin: 'top' }}
                    />
                </div>

                {/* play‑pause + waveform row */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={playPause}
                        disabled={!audioUrl}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 text-lg leading-none"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>

                    <canvas
                        ref={waveRef}
                        className="flex-1 h-[60px] cursor-pointer"
                        onClick={scrub}
                    />
                </div>

                <div className="text-sm text-right">
                    {fmtTime(curTime)} / {fmtTime(duration)}
                </div>

                {/* browse & export controls */}
                <section className="flex flex-wrap items-center gap-3">
                    <input type="file" accept="audio/*" onChange={loadFile}
                           className="file:mr-3 file:py-1.5 file:px-3 file:rounded-full
                                      file:border-0 file:text-sm file:font-semibold
                                      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>

                    <button onClick={exportCurrent} disabled={!audioUrl}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                        Export Current View
                    </button>
                    <button onClick={exportFull} disabled={!audioUrl}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                        Export Full View
                    </button>
                </section>

                {audioUrl&&(
                    <audio ref={audioRef} src={audioUrl}
                           onEnded={()=>setIsPlaying(false)} hidden/>
                )}
            </div>
        </main>
    );
}

Spectrogram.layoutOpts = { fullWidth: true };
export default withLayout(Spectrogram);
