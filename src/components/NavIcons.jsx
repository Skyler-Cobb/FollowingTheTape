// src/components/NavIcons.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../routes.jsx';

/* ---------------------------------------------
   helpers
---------------------------------------------- */
const strip = (p = '') =>
    p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;

const buildItems = (basePath) => {
    const root = strip(basePath || '/');

    /* 1) home grid → every top‑level route except Home itself */
    if (root === '/') {
        return routes
            .filter((r) => !r.hidden && r.path !== '/')
            .map(({ path, label, icon }) => ({ to: path, label, icon }));
    }

    /* 2) section grid → children of that section */
    const parent = routes.find((r) => strip(r.path) === root);
    if (!parent?.children) return [];

    return parent.children
        .filter((c) => !c.hidden)
        .map(({ path, label, icon }) => ({
            to: `${parent.path.replace(/\/$/, '')}/${path}`,
            label,
            icon,
        }));
};

/* ---------------------------------------------
   NavIcons component
---------------------------------------------- */
export default function NavIcons({
                                     basePath,
                                     className = '',
                                     iconSize = 'h-16 w-16',
                                     gap = 'gap-6',                      // ‑‑ more space between cards
                                 }) {
    const { pathname } = useLocation();
    const items = React.useMemo(() => buildItems(basePath), [basePath]);

    if (!items.length) return null;

    return (
        <div className={`flex flex-wrap justify-center ${gap} ${className}`}>
            {items.map(({ to, label, icon }) => {
                const active = strip(pathname).startsWith(strip(to));
                return (
                    <Link
                        key={to}
                        to={to}
                        className={`group flex flex-col items-center rounded-lg
                        border border-gray-700 bg-gray-800 p-4 shadow
                        transition-transform hover:-translate-y-1 hover:shadow-lg
                        ${active ? 'opacity-70' : ''}`}
                    >
                        <img src={icon} alt={label} className={iconSize} />
                        <span className="mt-2 text-sm text-white group-hover:underline">
              {label}
            </span>
                    </Link>
                );
            })}
        </div>
    );
}
