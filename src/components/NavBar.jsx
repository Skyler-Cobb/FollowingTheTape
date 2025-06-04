// src/components/NavBar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* ---------- lazy‑load routes ---------- */
function useTopRoutes() {
    const [topRoutes, setTopRoutes] = useState([]);
    useEffect(() => {
        let alive = true;
        import('../routes.jsx').then(({ routes }) => {
            if (!alive) return;
            setTopRoutes(
                routes
                    .filter(r => !r.hidden && r.path !== '*')
                    .map(r => ({
                        path:     r.path,
                        label:    r.label,
                        icon:     r.icon,
                        children: r.children?.filter(c => !c.hidden) ?? [],
                    })),
            );
        });
        return () => { alive = false; };
    }, []);
    return topRoutes;
}

/* ---------- colour constants ---------- */
const BORDER_CLR   = '#0c1118';         // darkest: borders & side padding
const STRIP_BG     = '#1a2331';         // main button strip
const DROPDOWN_BG  = '#1c2734';         // dropdown panel
const HOVER_BG     = '#1f2937';         // hover / active shade

/* ========================================================================== */

export default function NavBar() {
    const { pathname } = useLocation();
    const [openIdx, setOpenIdx] = useState(null);
    const topRoutes = useTopRoutes();

    if (topRoutes.length === 0) return null;

    return (
        <nav className="bg-[#0c1118] border-[3px] border-[#0c1118] shadow">
            <ul className="mx-auto flex w-full max-w-7xl list-none bg-[#1a2331]">
                {topRoutes.map((route, idx) => {
                    const isActive =
                        pathname === route.path ||
                        (route.children.length && pathname.startsWith(`${route.path}/`));

                    const Wrapper = ({ children }) => (
                        <li
                            className={`
                group relative flex-1
                border-[3px] border-[#0c1118]
                ${idx === 0 ? 'border-l-[3px]' : ''}
              `}
                            onMouseEnter={() => setOpenIdx(idx)}
                            onMouseLeave={() => setOpenIdx(null)}
                        >
                            {children}
                        </li>
                    );

                    /* ─── with dropdown ─────────────────────────────────── */
                    if (route.children.length) {
                        return (
                            <Wrapper key={route.path}>
                                <NavButton to={route.path} icon={route.icon} active={isActive}>
                                    {route.label}
                                </NavButton>

                                <ul
                                    className={`
                    absolute left-0 top-full z-50 hidden w-full
                    border-[3px] border-[#0c1118]
                    divide-y divide-[#0f1520]
                    rounded-b-[3px] bg-[#1c2734] py-1 shadow-lg
                    group-hover:block ${openIdx === idx ? 'block' : ''}
                  `}
                                >
                                    {route.children.map(child => (
                                        <li key={child.path}>
                                            <NavButton
                                                to={route.path === '/'
                                                    ? `/${child.path}`
                                                    : `${route.path}/${child.path}`}
                                                icon={child.icon}
                                                dropdown
                                            >
                                                {child.label}
                                            </NavButton>
                                        </li>
                                    ))}
                                </ul>
                            </Wrapper>
                        );
                    }

                    /* ─── top‑level without dropdown ─────────────────────── */
                    return (
                        <Wrapper key={route.path}>
                            <NavButton to={route.path} icon={route.icon} active={isActive}>
                                {route.label}
                            </NavButton>
                        </Wrapper>
                    );
                })}
            </ul>
        </nav>
    );
}

/* ---------- shared button ---------- */
function NavButton({ to, icon, children, active = false, dropdown = false }) {
    const base =
        'flex h-full w-full items-center justify-center whitespace-nowrap ' +
        'px-4 py-3 !text-white transition-colors duration-150';

    const normalBg = dropdown ? DROPDOWN_BG : STRIP_BG;
    const hoverBg  = dropdown ? HOVER_BG     : DROPDOWN_BG;
    const activeBg = HOVER_BG;

    return (
        <Link
            to={to}
            className={`${base}
                  bg-[${normalBg}]
                  hover:bg-[${hoverBg}]
                  ${active ? `bg-[${activeBg}]` : ''}`}
        >
            {icon && (
                <img
                    src={icon}
                    alt=""
                    className={`mr-2 flex-shrink-0 ${dropdown ? 'h-4 w-4' : 'h-5 w-5'}`}
                />
            )}
            {children}
        </Link>
    );
}
