// netlify/functions/blog-feed.mjs
const Parser = require('rss-parser');
const parser = new Parser({
    timeout: 10000,
    headers: { 'User-Agent': 'ftt-site/1.0 (+https://write.as/followingthetape/)' }
});

const BLOG     = 'followingthetape';
const FEED_URL = `https://write.as/${BLOG}/feed/`;

exports.handler = async () => {
    try {
        const feed = await parser.parseURL(FEED_URL);

        // Map each item to include `contentHtml` (the raw `<content:encoded>` HTML)
        const posts = feed.items.map(item => {
            const rawHtml = item['content:encoded'] || item.content || '';

            return {
                title:      item.title || '',
                link:       item.link || '',
                date:       item.isoDate || item.pubDate || '',
                contentHtml: rawHtml
            };
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=0, s-maxage=600'
            },
            body: JSON.stringify(posts)
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
