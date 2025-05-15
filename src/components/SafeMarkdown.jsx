// src/components/SafeMarkdown.jsx
import DOMPurify from 'dompurify';

// ALLOWED_ATTR / ADD_ATTR: add any <iframe> attributes you need
const purifier = DOMPurify;           // uses the global window

export default function SafeMarkdown({ html }) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: purifier.sanitize(html, {
                    ALLOWED_TAGS: [
                        'p', 'iframe', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'
                    ],
                    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
                }),
            }}
        />
    );
}
