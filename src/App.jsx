import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes.jsx';
import NavBar from './components/NavBar.jsx';

/* ---------------------------------------------------------------
 *  Recursively flatten nested route objects so <Routes> gets
 *  a single‑layer array.  Keeps catch‑all '*' intact.
 * ------------------------------------------------------------- */
function flatten(route, base = '') {
    if (route.path === '*') return [{ ...route, fullPath: '*' }];

    const full = route.path.startsWith('/')
        ? route.path
        : `${base}${base && !base.endsWith('/') ? '/' : ''}${route.path}`;

    const here      = { ...route, fullPath: full };
    const descendants = (route.children || []).flatMap(child =>
        flatten(child, full)
    );

    return [here, ...descendants];
}

export default function App() {
    const flatRoutes = routes.flatMap(r => flatten(r));

    return (
        <Router>
            <NavBar /> {/* renders once for every page */}
            <Routes>
                {flatRoutes.map(({ fullPath, component: C }) => (
                    <Route key={fullPath} path={fullPath} element={<C />} />
                ))}
            </Routes>
        </Router>
    );
}
