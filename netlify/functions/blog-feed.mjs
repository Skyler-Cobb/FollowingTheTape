// netlify/functions/blog-feed.mjs          (ES module)
/* eslint-env node */
import { builder } from '@netlify/functions';

const FEED_URL =
    'https://followingthetapes.wordpress.com/wp-json/wp/v2/posts?per_page=10&_fields=title,link,excerpt,date';

/** Strip basic HTML tags (for <p>, <em>, etc.) */
const toPlain = (html = '') => html.replace(/<[^>]*>/g, '').trim();

export const handler = builder(async () => {
    const resp = await fetch(FEED_URL);
    if (!resp.ok)
        return {
            statusCode: resp.status,
            body: `Failed to fetch feed (${resp.status})`,
        };

    const posts = await resp.json();

    const items = posts.map((p) => ({
        title: toPlain(p.title.rendered),
        link: p.link,
        date: p.date,
        excerpt: toPlain(p.excerpt?.rendered ?? ''),
    }));

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
    };
}, { ttl: 600 }); // 10‑minute cache at Netlify’s edge
