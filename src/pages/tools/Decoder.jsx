// src/pages/tools/Decoder.jsx
import React, { useEffect, useMemo, useState } from 'react'
import withLayout from '../../hoc/withLayout.jsx'

/* --------------------------------------------------------------------
   1. Helpers (unchanged except where noted)
------------------------------------------------------------------------*/
const asList = (x) => (Array.isArray(x) ? x : x == null ? [null] : [x])

const normalizeMap = (m) =>
    Object.fromEntries(
        Object.entries(m).map(([k, v]) => [k, Array.isArray(v) ? v : [v]])
    )

const invert = (orig) => {
    const inv = {}
    Object.entries(orig).forEach(([k, v]) => {
        asList(v).forEach((s) => {
            inv[s] = inv[s] || []
            inv[s].push(k)
        })
    })
    return inv
}

const getMap = (m) => m.encoding
const getSettings = (m) => m.settings ?? m.usage ?? {}

const recursiveDecode = (word, map, lenient, memo = {}) => {
    if (word === '') return ['']
    if (memo[word]) return memo[word]
    const out = []
    let matched = false
    for (const tok of Object.keys(map)) {
        if (word.startsWith(tok)) {
            matched = true
            map[tok].forEach((dec) =>
                recursiveDecode(word.slice(tok.length), map, lenient, memo).forEach(
                    (tail) => out.push(dec + tail)
                )
            )
        }
    }
    if (!matched && lenient) {
        recursiveDecode(word.slice(1), map, lenient, memo).forEach((tail) =>
            out.push(word[0] + tail)
        )
    }
    memo[word] = out
    return out
}

/* --------------------------------------------------------------------
   2. Core encode / decode
------------------------------------------------------------------------*/

/* --------------------------------------------------------------------
   encodeWithModule  — returns a single string.
   • If only one variant exists, that variant is returned as‑is.
   • If several variants exist, they’re wrapped in labeled blocks.
-------------------------------------------------------------------*/
function encodeWithModule(module, text, ignoreCase) {
    const st = getSettings(module)

    /* build forward map (plain → code) */
    const map = normalizeMap(
        st.reverse_direction ? getMap(module) : invert(getMap(module))
    )

    /* case‑fold if the user asked and mapping itself is case‑insensitive */
    const caseSensitive = Object.keys(map).some(
        (k) => k !== k.toUpperCase() && k !== k.toLowerCase()
    )
    let plain = text
    if (!caseSensitive && ignoreCase) {
        const hasUpper = Object.keys(map).some((k) => k === k.toUpperCase())
        plain = hasUpper ? text.toUpperCase() : text.toLowerCase()
    }

    /* iterate over every separator combination */
    const charSepList = asList(st.character_separator)
    const wordSepList = asList(st.word_separator)

    const variants = []
    const seen = new Set()

    for (const rawCs of charSepList) {
        const cs = rawCs ?? ''              // null → ''
        const csDesc = rawCs == null ? 'null' : `"${cs || '␀'}"` // visualise blanks

        for (const rawWs of wordSepList) {
            const ws = rawWs ?? ' '
            /* encode one way */
            const encoded = plain
                .split(' ')
                .map((w) =>
                    w
                        .split('')
                        .map((c) => map[c]?.[0] ?? c)
                        .join(cs)
                )
                .join(ws)

            if (!seen.has(encoded)) {
                seen.add(encoded)
                variants.push({ encoded, csDesc })
            }
        }
    }

    /* single variant → return raw */
    if (variants.length === 1) {
        return variants[0].encoded
    }

    /* multiple variants → pretty format */
    const line = '-----------------------------------------------------------'
    return variants
        .map(
            ({ encoded, csDesc }, i) =>
                `${line}\nEncoding #${i + 1} (Using ${csDesc} as character separator):\n${encoded}`
        )
        .join('\n') + `\n${line}`
}

function tokenizeMessage(module, cipher) {
    const st = getSettings(module)
    const charS = asList(st.character_separator).map((s) => s ?? '')
    const wordS = asList(st.word_separator).map((s) => s ?? ' ')
    const chunk = st.chunk_size?.[0] ?? null

    const configs = []
    for (const ws of wordS) {
        const words = ws ? cipher.split(ws) : [cipher]
        for (const cs of charS) {
            const cfg = []
            let ok = true
            for (let raw of words) {
                raw = raw.trim()
                if (!raw) continue
                let toks
                if (cs) toks = raw.split(cs).filter(Boolean)
                else if (chunk) toks = raw.match(new RegExp(`.{1,${chunk}}`, 'g')) ?? []
                else toks = [raw] // null char‑sep: treat whole word as one token
                if (!toks.length) {
                    ok = false
                    break
                }
                cfg.push(toks)
            }
            if (ok) configs.push({ cfg, charSepBlank: !cs })
        }
    }
    return configs
}

function decodeWithModule(module, cipher, dictSet, requirePerfect) {
    const st = getSettings(module)
    const lenient = !requirePerfect
    const map = normalizeMap(
        st.reverse_direction ? invert(getMap(module)) : getMap(module)
    )
    const cfgs = tokenizeMessage(module, cipher.replace(/\r?\n/g, ' '))
    const outputs = new Set()

    cfgs.forEach(({ cfg, charSepBlank }) => {
        let paths = ['']
        outer: for (const toks of cfg) {
            let variants
            if (charSepBlank && toks.length === 1) {
                variants = recursiveDecode(toks[0], map, lenient)
            } else {
                const arrs = toks.map((t) =>
                    map[t] !== undefined ? map[t] : lenient ? [t] : null
                )
                variants = arrs.reduce(
                    (acc, choices) =>
                        acc && choices
                            ? acc.flatMap((p) => choices.map((c) => p + c))
                            : null,
                    ['']
                )
            }
            if (!variants || !variants.length) {
                paths = []
                break outer
            }
            paths = paths.flatMap((p) =>
                variants.map((v) => (p ? p + ' ' + v : v))
            )
        }
        paths.forEach((p) => outputs.add(p.trim()))
    })

    // dictionary ranking
    const arr = [...outputs]
    if (!dictSet || arr.length <= 1) return arr
    const scored = arr
        .map((s) => ({
            s,
            score: s
                .split(' ')
                .filter((w) => dictSet.has(w.toUpperCase()))
                .length,
        }))
        .sort((a, b) => b.score - a.score)
    const bestScore = scored[0].score
    return scored.filter((x) => x.score === bestScore).map((x) => x.s)
}

/* --------------------------------------------------------------------
   3. React component
------------------------------------------------------------------------*/

const moduleFiles = [
    'ABC Multitap.json',
    'Keyboard Symbol Cipher.json',
    'Morse Code.json',
    'Number-Dot Cipher.json',
    'T9 Cipher.json',
    '1337.json',
]

function Decoder() {
    const [modules, setModules] = useState({})
    const [dict, setDict] = useState(null)
    const [loading, setLoading] = useState(true)

    /* UI state */
    const [mode, setMode] = useState('decode')
    const [moduleName, setModuleName] = useState('Auto-Detect')
    const [requirePerfect, setRequirePerfect] = useState(true)
    const [requireDict, setRequireDict] = useState(false)
    const [ignoreCase, setIgnoreCase] = useState(false)
    const [input, setInput] = useState('')

    /* load JSON modules and dictionary */
    useEffect(() => {
        ;(async () => {
            const map = {}
            await Promise.all(
                moduleFiles.map(async (f) => {
                    try {
                        const res = await fetch(`/resources/modules/${encodeURIComponent(f)}`)
                        if (res.ok) map[f.replace(/\.json$/i, '')] = await res.json()
                    } catch {}
                })
            )
            setModules(map)

            try {
                const res = await fetch('/resources/data/dictionary.txt')
                if (res.ok) {
                    const txt = await res.text()
                    setDict(new Set(txt.split(/\r?\n/).map((w) => w.trim().toUpperCase())))
                }
            } catch {}
            setLoading(false)
        })()
    }, [])

    /* when switching to ENCODE, drop Auto‑Detect */
    useEffect(() => {
        if (mode === 'encode' && moduleName === 'Auto-Detect') {
            const first = Object.keys(modules)[0]
            if (first) setModuleName(first)
        }
    }, [mode, moduleName, modules])

    const currentModule = modules[moduleName]

    /* compute output */
    const output = useMemo(() => {
        if (loading) return 'Loading modules…'
        if (!input.trim()) return ''

        if (mode === 'encode') {
            if (!currentModule) return '❌ Select a module.'
            return encodeWithModule(currentModule, input, ignoreCase)
        }

        /* ---- DECODE ---- */
        const decodeModule = (mod) =>
            decodeWithModule(
                mod,
                input,
                dict,
                requirePerfect // to set lenient flag
            ).filter((txt) =>
                requireDict && dict
                    ? txt
                        .split(' ')
                        .every((w) => !w || dict.has(w.toUpperCase()))
                    : true
            )

        if (moduleName === 'Auto-Detect') {
            const aggregated = Object.entries(modules)
                .map(([name, mod]) => {
                    const outs = decodeModule(mod)
                    return outs.length ? { name, outs } : null
                })
                .filter(Boolean)

            if (!aggregated.length) return '❌ No module could decode this input.'

            return aggregated
                .map(
                    ({ name, outs }) =>
                        `# ${name}\n` + outs.map((o) => '  • ' + o).join('\n')
                )
                .join('\n\n')
        }

        const outs = decodeModule(currentModule)
        return outs.length ? outs.join('\n') : '❌ Unable to decode.'
    }, [
        loading,
        input,
        mode,
        moduleName,
        modules,
        currentModule,
        requirePerfect,
        requireDict,
        ignoreCase,
        dict,
    ])

    /* ----------------------------------------------------------------
       4.  Render
    -----------------------------------------------------------------*/
    return (
        <section className="mx-auto max-w-6xl p-4 lg:p-6 space-y-8">
            <h1 className="text-3xl font-semibold">Decoder&nbsp;/&nbsp;Encoder</h1>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 rounded bg-gray-800 p-4">
                {/* Module selector */}
                <select
                    className="rounded bg-gray-900 px-3 py-1"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                >
                    {mode === 'decode' && <option>Auto-Detect</option>}
                    {Object.keys(modules).map((m) => (
                        <option key={m}>{m}</option>
                    ))}
                </select>

                {mode === 'decode' && (
                    <>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={requirePerfect}
                                onChange={(e) => setRequirePerfect(e.target.checked)}
                            />
                            Require&nbsp;perfect&nbsp;translation
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={requireDict}
                                onChange={(e) => setRequireDict(e.target.checked)}
                            />
                            Require&nbsp;dictionary&nbsp;match
                        </label>
                    </>
                )}

                {mode === 'encode' && (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={ignoreCase}
                            onChange={(e) => setIgnoreCase(e.target.checked)}
                        />
                        Ignore&nbsp;case
                    </label>
                )}

                <div className="ml-auto flex items-center gap-4">
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="mode"
                            value="decode"
                            checked={mode === 'decode'}
                            onChange={() => setMode('decode')}
                        />
                        Decode
                    </label>
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="mode"
                            value="encode"
                            checked={mode === 'encode'}
                            onChange={() => setMode('encode')}
                        />
                        Encode
                    </label>
                </div>
            </div>

            {/* Text areas */}
            <div className="grid gap-6 lg:grid-cols-2">
        <textarea
            className="h-64 w-full resize-y rounded bg-gray-900 p-4 text-sm"
            placeholder="Enter text or code here…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
                <textarea
                    readOnly
                    className="h-64 w-full resize-y rounded bg-gray-900 p-4 text-sm text-green-300"
                    value={output}
                />
            </div>
        </section>
    )
}

Decoder.layoutOpts = { fullWidth: false }
export default withLayout(Decoder)