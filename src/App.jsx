// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { routes } from './routes.jsx';
import Analytics from './components/Analytics.jsx';  // NavBar import removed

/* --------------------------------------------------------------------------------------
 * Recursively flatten nested <routes> so <Routes> receives a simple single‑level list.
 * ------------------------------------------------------------------------------------- */
function flatten(route, base = '') {
    if (route.path === '*') return [{ ...route, fullPath: '*' }];

    const full = route.path.startsWith('/')
        ? route.path
        : `${base}${base && !base.endsWith('/') ? '/' : ''}${route.path}`;

    const here        = { ...route, fullPath: full };
    const descendants = (route.children || []).flatMap(child =>
        flatten(child, full)
    );

    return [here, ...descendants];
}

export default function App() {
    const flatRoutes = routes.flatMap(r => flatten(r));

    return (
        <Router>
            <Analytics />
            <Routes>
                {flatRoutes.map(({ fullPath, component: C }) => (
                    <Route key={fullPath} path={fullPath} element={<C />} />
                ))}
            </Routes>
        </Router>
    );
}
