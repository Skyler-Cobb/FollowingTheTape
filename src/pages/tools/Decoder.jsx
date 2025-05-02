// src/pages/tools/Decoder.jsx
import React, { useEffect, useState, useMemo } from 'react'
import withLayout from '../../hoc/withLayout.jsx'

/* --------------------------------------------------------------
   1.  Small helpers (ported from decoder.py)
----------------------------------------------------------------*/
const asList = (x) => (Array.isArray(x) ? x : x == null ? [null] : [x])

const buildInverse = (map) => {
    const inv = {}
    Object.entries(map).forEach(([k, v]) => {
        const arr = Array.isArray(v) ? v : [v]
        arr.forEach((s) => {
            inv[s] = inv[s] || []
            inv[s].push(k)
        })
    })
    return inv
}

const getMapping = (m) =>
    (m.encoding ?? m.morse ?? {}).reduce
        ? m.encoding
        : Object.fromEntries(
            Object.entries(m.encoding ?? m.morse ?? {}).filter(([k]) => k !== '')
        )

const getSettings = (m) => m.settings ?? m.usage ?? {}

const expandInMap = (token, mapping, flawed = false) => {
    if (token in mapping) {
        const v = mapping[token]
        return Array.isArray(v) ? v : [v]
    }
    return flawed ? [token] : null
}

/* brute-force recursive parse (like python version) */
const decodeRec = (word, mapping, flawed) => {
    const memo = {}
    const dfs = (rem) => {
        if (rem === '') return ['']
        if (memo[rem]) return memo[rem]
        const out = []
        let matched = false
        for (const key of Object.keys(mapping)) {
            if (rem.startsWith(key)) {
                const exps = expandInMap(key, mapping, false)
                const suf = dfs(rem.slice(key.length))
                exps.forEach((e) => suf.forEach((s) => out.push(e + s)))
                matched = true
            }
        }
        if (!matched && flawed && rem) {
            const c = rem[0]
            dfs(rem.slice(1)).forEach((s) => out.push(c + s))
        }
        memo[rem] = out
        return out
    }
    return dfs(word)
}

/* core decode (simplified: no newline→space rewrite accuracy etc.) */
function decodeWithModule(module, text, flawed = false) {
    const settings = getSettings(module)
    const orig = getMapping(module)
    const rev = settings.reverse_direction
    const caseSensitive = Object.keys(orig).some((k) => k !== k.toUpperCase())

    const mapping = rev ? buildInverse(orig) : orig
    let msg = text
    if (!caseSensitive) {
        msg = msg.toUpperCase()
    }

    const wsList = asList(settings.word_separator)
    const csList = asList(settings.character_separator)
    const out = new Set()

    wsList.forEach((ws) => {
        csList.forEach((cs) => {
            const words = ws ? msg.split(ws) : [msg]
            const perWord = []
            let ok = true
            for (let w of words) {
                w = w.trim()
                if (!w) continue
                if (cs) {
                    const toks = w.split(cs).filter(Boolean)
                    const perTok = toks.map((t) => expandInMap(t, mapping, flawed))
                    if (perTok.some((p) => p == null)) {
                        ok = false
                        break
                    }
                    perWord.push(perTok.reduce((a, b) => a.flatMap((x) => b.map((y) => x + y))))
                } else {
                    const variants = decodeRec(w, mapping, flawed)
                    if (!variants.length) {
                        ok = false
                        break
                    }
                    perWord.push(variants)
                }
            }
            if (ok && perWord.length) {
                perWord
                    .reduce((a, b) => a.flatMap((x) => b.map((y) => (x ? x + ' ' + y : y))))
                    .forEach((z) => out.add(z))
            }
        })
    })
    return [...out]
}

function encodeWithModule(module, text) {
    const settings = getSettings(module)
    const map = getMapping(module)
    const rev = settings.reverse_direction
    const caseSensitive = Object.keys(map).some((k) => k !== k.toUpperCase())
    const inv = rev ? map : buildInverse(map)
    let pt = text
    if (!caseSensitive) pt = pt.toUpperCase()

    const words = pt.split(' ')
    const all = words.map((w) => {
        const toks = w.split('')
        const perChar = toks.map((c) => inv[c] ?? [c])
        return perChar.reduce((a, b) => a.flatMap((x) => b.map((y) => x + y)))
    })

    const joinChar = settings.character_separator ?? ''
    const joinWord = settings.word_separator ?? ' '
    return all
        .reduce((a, b) => a.flatMap((x) => b.map((y) => (x ? x + joinWord + y : y))))
        .map((s) => s.replace(/ +/g, ' ').trim())
}

/* --------------------------------------------------------------
   2.  React component
----------------------------------------------------------------*/
function Decoder() {
    /* modules loaded from public/resources/modules/*.json */
    const [modules, setModules] = useState({})
    const [moduleName, setModuleName] = useState('')
    const [mode, setMode] = useState('decode')
    const [flawed, setFlawed] = useState(false)
    const [input, setInput] = useState('')
    const dictionary = useMemo(() => new Set(), []) // placeholder

    /* load modules on mount */
    useEffect(() => {
        const ctx = import.meta.glob('/resources/modules/*.json', { eager: true })
        const mod = {}
        Object.entries(ctx).forEach(([path, modData]) => {
            const name = decodeURIComponent(path.split('/').pop().replace('.json', ''))
            mod[name] = modData
        })
        setModules(mod)
        setModuleName(Object.keys(mod)[0] ?? '')
    }, [])

    const currentModule = modules[moduleName]

    /* compute output */
    const output = useMemo(() => {
        if (!currentModule || !input.trim()) return ''
        if (mode === 'encode') {
            return encodeWithModule(currentModule, input).join('\n')
        }
        return decodeWithModule(currentModule, input, flawed).join('\n')
    }, [currentModule, input, mode, flawed])

    if (!moduleName) {
        return (
            <div className="mx-auto my-10 text-center">
                <p>No modules found in <code>public/resources/modules/</code>.</p>
            </div>
        )
    }

    return (
        <section className="flex flex-col gap-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2">
                    Module:
                    <select
                        className="rounded bg-gray-800 p-1"
                        value={moduleName}
                        onChange={(e) => setModuleName(e.target.value)}
                    >
                        {Object.keys(modules).map((n) => (
                            <option key={n}>{n}</option>
                        ))}
                    </select>
                </label>

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

                {mode === 'decode' && (
                    <label className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={flawed}
                            onChange={(e) => setFlawed(e.target.checked)}
                        />
                        Flawed decode
                    </label>
                )}
            </div>

            {/* Textareas */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <textarea
            className="h-52 w-full resize-y rounded bg-gray-900 p-3 text-sm text-white"
            placeholder="Enter text here…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
                <textarea
                    readOnly
                    className="h-52 w-full resize-y rounded bg-gray-900 p-3 text-sm text-green-300"
                    value={output}
                />
            </div>
        </section>
    )
}

Decoder.layoutOpts = { fullWidth: false /* uses default centred layout */ }

export default withLayout(Decoder)
