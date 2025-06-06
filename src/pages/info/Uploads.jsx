// src/pages/Uploads.jsx
import React, { useEffect, useMemo, useState } from 'react';
import withLayout from '../../hoc/withLayout.jsx';
import Papa from 'papaparse';

/* ------------------------------------------------------------------ */
/* 1)  Where the data lives                                           */
/* ------------------------------------------------------------------ */
/**
 * The sheet is published to the web as CSV:
 *   File ► Share ► Publish to web ► Link ► CSV
 *   (Netlify + browser can fetch it without CORS issues.)
 *
 * If you ever move / duplicate the sheet, only this URL changes.
 */
const SHEET_CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRS0Ux_bvBFUJTGux8xrlT0F0PHxZMWRXgReEbyz3Zm3D2XVPeonB0iO1ylYR-bqDR22zgacue65mPa/pub?output=csv';

/* ------------------------------------------------------------------ */
/* 2)  UI filter options                                              */
/* ------------------------------------------------------------------ */
const TYPE_OPTIONS = [
    'All',
    'Videos',
    'Videos (main)',
    'Shorts',
    'Community Posts',
    'Sites',
    'Other',
];

const PERIOD_OPTIONS = ['Any', 'Currently Released', 'Upcoming', 'Archived'];

/* sheet.type → display‑filter mapping */
const filterMap = {
    All: null,
    Videos: new Set(['video_main', 'video_side']),
    'Videos (main)': new Set(['video_main']),
    Shorts: new Set(['yt_short']),
    'Community Posts': new Set(['community_post']),
    Sites: new Set(['website']),
    Other: 'other', // handled specially in the filter fn
};

const periodToStatus = {
    Any: null,
    'Currently Released': 'released',
    Upcoming: 'upcoming',
    Archived: 'archived',
};

const PLACEHOLDER = '/assets/thumbnails/placeholder.png';

/* ------------------------------------------------------------------ */
/* 3)  Helpers                                                        */
/* ------------------------------------------------------------------ */
function computeStatus({ archive_date, upload_date }) {
    const today = new Date();
    if (archive_date) return 'archived';
    if (!upload_date || upload_date.toLowerCase() === 'tbd') return 'upcoming';
    return new Date(upload_date) > today ? 'upcoming' : 'released';
}

function thumbPath(row) {
    const { thumbnail } = row;

    if (!thumbnail) {
        console.log('⛔ thumbnail empty → placeholder', row.name);
        return PLACEHOLDER;
    }
    if (/^https?:\/\/|^\//i.test(thumbnail)) return thumbnail;

    const url = `/assets/thumbnails/${encodeURIComponent(thumbnail)}`;
    return url;
}

function capitalize(str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ------------------------------------------------------------------ */
/* 4)  Component                                                      */
/* ------------------------------------------------------------------ */
function Uploads() {
    /* page title */
    useEffect(() => {
        document.title = 'Uploads – Following The Tape';
    }, []);

    /* remote data state */
    const [uploadsData, setUploadsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* filters */
    const [typeFilter, setTypeFilter] = useState('All');
    const [periodFilter, setPeriodFilter] = useState('Any');

    /* 4·1  fetch the sheet once on mount */
    useEffect(() => {
        let abort = false;

        (async () => {
            try {
                const res = await fetch(SHEET_CSV_URL);
                const csv = await res.text();

                const { data: rows } = Papa.parse(csv, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (h) => h.replace(/^\uFEFF/, '').trim().toLowerCase(),
                    transform: (v) => (v ?? '').trim(),
                });

                if (abort) return;
                setUploadsData(
                    rows.map((row, idx) => ({
                        id: row.id || idx + 1,
                        type: row.type,
                        upload_type: row.upload_type,
                        status: computeStatus(row),
                        name: row.name,
                        description: row.description,
                        description_alt: row.description_alt,
                        notes: row.notes,
                        upload_date: row.upload_date,
                        archive_date: row.archive_date,
                        link: row.link,
                        file_dl: row.file_dl,
                        thumbnail: row.thumbnail,
                    })),
                );
            } catch (e) {
                if (!abort) setError(e);
            } finally {
                if (!abort) setLoading(false);
            }
        })();

        return () => (abort = true);
    }, []);

    /* 4·2  derived, filtered rows */
    const rows = useMemo(() => {
        const wantedTypes = filterMap[typeFilter];
        const wantedStatus = periodToStatus[periodFilter];

        return uploadsData.filter((row) => {
            /* type filter */
            let typeOk = true;
            if (wantedTypes === 'other') {
                typeOk =
                    row.type === 'other' ||
                    ![
                        'video_main',
                        'video_side',
                        'yt_short',
                        'community_post',
                        'website',
                    ].includes(row.type);
            } else if (wantedTypes instanceof Set) {
                typeOk = wantedTypes.has(row.type);
            }
            /* period filter */
            const periodOk = !wantedStatus || row.status === wantedStatus;
            return typeOk && periodOk;
        });
    }, [uploadsData, typeFilter, periodFilter]);

    /* ---------------------------------------------------------------- */
    /* 4·3  render                                                      */
    /* ---------------------------------------------------------------- */
    if (loading) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-20 text-center">
                <p className="animate-pulse text-gray-400">Loading uploads…</p>
            </main>
        );
    }
    if (error) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-20 text-center">
                <p className="text-red-400">Failed to load uploads.</p>
                <pre className="mt-4 text-xs text-gray-400">
          {String(error.message || error)}
        </pre>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">
                Uploads
            </h1>

            {/* ---------------------------------------------------------------- */}
            {/* filters                                                         */}
            {/* ---------------------------------------------------------------- */}
            <div className="mb-6 flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2">
                    <span className="text-sm font-medium">Type:</span>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm"
                    >
                        {TYPE_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>
                </label>

                <label className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm font-medium">
            Time Period:
          </span>
                    <select
                        value={periodFilter}
                        onChange={(e) => setPeriodFilter(e.target.value)}
                        className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm"
                    >
                        {PERIOD_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>
                </label>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* table                                                           */}
            {/* ---------------------------------------------------------------- */}
            <div className="overflow-x-auto rounded border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700 text-sm">
                    <thead className="bg-gray-900">
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold">Thumbnail</th>
                        <th className="px-4 py-2 text-left font-semibold">Name</th>
                        <th className="px-4 py-2 text-left font-semibold w-full">
                            Description
                        </th>
                        <th className="px-2 py-2 text-center font-semibold w-36">Date</th>
                        <th className="px-4 py-2 text-left font-semibold">Misc</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                    {rows.map((row) => {
                        /* ---- DATE CELL ---- */
                        const dateLines = [
                            `${capitalize(row.upload_type)}:`,
                            row.upload_date || 'TBD',
                        ];
                        if (row.archive_date) {
                            dateLines.push('Archived:', row.archive_date);
                        }
                        const dateText = dateLines.join('\n');

                        /* ---- DESCRIPTION CELL ---- */
                        const descLines = [];
                        if (row.description) descLines.push(`YT Desc: ${row.description}`);
                        if (row.description_alt)
                            descLines.push(`Site Desc: ${row.description_alt}`);
                        if (row.notes) descLines.push(`Notes: ${row.notes}`);
                        const descText = descLines.join('\n');

                        /* misc links */
                        const miscLinks = [];
                        if (row.link)
                            miscLinks.push(
                                <a
                                    key="link"
                                    href={row.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:underline"
                                >
                                    [Link]
                                </a>,
                            );
                        if (row.file_dl)
                            miscLinks.push(
                                <a
                                    key="file"
                                    href={`/resources/files/${row.file_dl}`}
                                    download={row.file_dl}
                                    className="text-indigo-400 hover:underline"
                                >
                                    [{row.file_dl}]
                                </a>,
                            );

                        return (
                            <tr key={row.id} className="hover:bg-gray-800/60">
                                {/* thumbnail */}
                                <td className="px-4 py-2">
                                    <img
                                        src={thumbPath(row)}
                                        alt=""
                                        className="h-16 w-28 rounded object-cover"
                                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                                    />
                                </td>

                                {/* name */}
                                <td className="px-4 py-2 font-medium">{row.name}</td>

                                {/* description */}
                                <td className="px-4 py-2 whitespace-pre-line text-gray-300">
                                    {descText}
                                </td>

                                {/* date – centred, stacked */}
                                <td className="px-2 py-2 whitespace-pre-line text-center">
                                    {dateText}
                                </td>

                                {/* misc */}
                                <td className="px-4 py-2 space-x-2">{miscLinks}</td>
                            </tr>
                        );
                    })}

                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                                No uploads match the selected filters.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default withLayout(Uploads);
