import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../routes.jsx';   // ← note “.jsx” extension

// First‑level routes that should appear in the nav
const topRoutes = routes.filter(r => !r.hidden && r.path !== '*');

export default function NavBar() {
    const { pathname } = useLocation();
    const [openIdx, setOpenIdx] = useState(null);

    return (
        <nav className="bg-gray-900 text-white shadow">
            <ul className="mx-auto flex w-full max-w-7xl list-none">
                {topRoutes.map((route, idx) => {
                    const isActive =
                        pathname === route.path ||
                        (route.children && pathname.startsWith(`${route.path}/`));

                    /* -------- DROPDOWN -------- */
                    if (route.children?.length) {
                        return (
                            <li
                                key={route.path}
                                className="group relative flex-1"
                                onMouseEnter={() => setOpenIdx(idx)}
                                onMouseLeave={() => setOpenIdx(null)}
                            >
                                <NavButton to={route.path} active={isActive}>
                                    {route.label}
                                </NavButton>

                                <ul
                                    className={`absolute left-0 top-full hidden w-full divide-y divide-gray-100 rounded-b-md bg-white py-1 text-gray-900 shadow-lg group-hover:block ${
                                        openIdx === idx ? 'block' : ''
                                    }`}
                                >
                                    {route.children.map(child => (
                                        <li key={child.path}>
                                            <NavButton
                                                to={`${route.path}/${child.path}`}
                                                dropdown
                                            >
                                                {child.label}
                                            </NavButton>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    }

                    /* -------- TOP‑LEVEL -------- */
                    return (
                        <li key={route.path} className="relative flex-1">
                            <NavButton to={route.path} active={isActive}>
                                {route.label}
                            </NavButton>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

/* ---- shared link styling ---- */
function NavButton({ to, children, active = false, dropdown = false }) {
    const base =
        'flex h-full w-full items-center justify-center whitespace-nowrap px-4 py-3 transition-colors duration-150';

    const activeBg = dropdown ? 'bg-gray-100' : 'bg-gray-800';
    const normalBg = dropdown ? 'bg-white text-gray-900' : 'bg-gray-900';
    const hoverBg  = dropdown ? 'hover:bg-gray-100' : 'hover:bg-gray-800';

    return (
        <Link
            to={to}
            className={`${base} ${normalBg} ${hoverBg} ${active ? activeBg : ''}`}
        >
            {children}
        </Link>
    );
}
