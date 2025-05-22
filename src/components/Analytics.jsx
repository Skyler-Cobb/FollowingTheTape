import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * <Analytics/> fires a "page_view" to GA‑4 whenever React‑Router changes route.
 * It renders nothing; just drop it once inside your Router.
 */
export default function Analytics() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        // gtag is injected by the <script> in index.html
        if (typeof window.gtag !== 'function' || !MEASUREMENT_ID) return;

        window.gtag('event', 'page_view', {
            page_path: pathname + search,
            page_location: window.location.href,
            send_to: MEASUREMENT_ID,
        });
    }, [pathname, search]);

    return null;
}
