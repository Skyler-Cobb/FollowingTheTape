/* ── NavBar.jsx (gap-less, equal-width, flush dropdowns) ── */
import React from "react";
import { Link, useLocation } from "react-router-dom";

/* ------- nav data stays unchanged ----------------------------------- */
const siteMap = [
    { kind: "internal", label: "Home", to: "/" },
    {
        kind: "dropdown",
        label: "Tools",
        items: [
            { kind: "internal", label: "Decoder", to: "/tools/decoder" },
            { kind: "internal", label: "Spectrogram", to: "/tools/spectrogram" },
        ],
    },
    { kind: "internal", label: "Hints", to: "/hints" },
    {
        kind: "dropdown",
        label: "Resources",
        to: "/resources",
        items: [
            { kind: "internal", label: "Uploads", to: "/resources/uploads" },
            { kind: "internal", label: "Transcripts", to: "/resources/transcripts" },
            { kind: "internal", label: "Recordings", to: "/resources/recordings" },
            { kind: "internal", label: "Sightings", to: "/resources/sightings" },
        ],
    },
    {
        kind: "dropdown",
        label: "Links",
        items: [
            {
                kind: "external",
                label: "Official YouTube Channel",
                url: "https://www.youtube.com/@followthetape",
            },
            {
                kind: "external",
                label: "Unofficial Subreddit",
                url: "https://www.reddit.com/r/itsgettinglate/",
            },
        ],
    },
    {
        kind: "dropdown",
        label: "Meta",
        items: [
            { kind: "internal", label: "About the Creator", to: "/meta/about-the-creator" },
            { kind: "internal", label: "About this Site", to: "/meta/about-this-site" },
        ],
    },
];

/* ------- main component --------------------------------------------- */
export default function NavBar() {
    const { pathname } = useLocation();

    return (
        <nav className="bg-gray-900 text-white shadow">
            <ul className="mx-auto flex w-full max-w-7xl list-none">
                {siteMap.map((item) =>
                    item.kind === "dropdown" ? (
                        <Dropdown key={item.label} item={item} pathname={pathname} />
                    ) : (
                        <li key={item.label} className="relative flex-1">
                            <NavLink item={item} active={pathname === item.to} />
                        </li>
                    )
                )}
            </ul>
        </nav>
    );
}

/* ------- helpers ----------------------------------------------------- */
function NavLink({ item, active, dropdown = false }) {
    /* full-width clickable rectangle, centred label */
    const base =
        "flex h-full w-full items-center justify-center whitespace-nowrap px-4 py-3 transition-colors duration-150 text-white visited:text-white";

    const normalBg = dropdown ? "bg-white" : "bg-gray-900";
    const hoverBg = dropdown ? "hover:bg-gray-100" : "hover:bg-gray-800";
    const activeBg = dropdown ? "bg-gray-100" : "bg-gray-800";

    const className = [
        base,
        dropdown ? "text-gray-900" : "",
        active ? activeBg : normalBg,
        hoverBg,
    ].join(" ");

    if (item.kind === "external") {
        return (
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
            >
                {item.label}
            </a>
        );
    }

    return (
        <Link to={item.to} className={className}>
            {item.label}
        </Link>
    );
}

function Dropdown({ item, pathname }) {
    const { label, to, items } = item;
    const activeParent = to && pathname === to;

    return (
        <li className="group relative flex-1">
            {/* parent trigger rectangle */}
            {to ? (
                <NavLink
                    item={{ kind: "internal", label, to }}
                    active={activeParent}
                />
            ) : (
                <span className="flex h-full w-full cursor-default items-center justify-center bg-gray-900 px-4 py-3 group-hover:bg-gray-800">
          {label}
        </span>
            )}

            {/* dropdown panel — no margin so it touches the trigger */}
            <ul className="absolute left-0 top-full hidden w-full divide-y divide-gray-100 rounded-b-md bg-white py-1 text-gray-900 shadow-lg group-hover:block">
                {items.map((child) => (
                    <li key={child.label}>
                        <NavLink item={child} dropdown />
                    </li>
                ))}
            </ul>
        </li>
    );
}
