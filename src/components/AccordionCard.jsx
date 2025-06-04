// src/components/AccordionCard.jsx
import React from 'react';

/**
 * AccordionCard
 * -------------
 * Props:
 *   • icon   – string  (URL of the icon PNG)
 *   • title  – string  (heading text)
 *   • children – ReactNode (the hidden content)
 *
 * Uses native <details>/<summary> for accessibility, plus Tailwind for style.
 */
export default function AccordionCard({ icon, title, children }) {
    return (
        <details
            className="group rounded-lg border border-gray-700 bg-gray-800
                 p-4 shadow [&_summary::-webkit-details-marker]:hidden mb-4"
        >
            <summary className="flex cursor-pointer items-center list-none select-none">
                <img src={icon} alt="" className="mr-3 h-6 w-6 flex-shrink-0" />
                <span className="font-medium text-white">{title}</span>

                {/* chevron; rotates when open */}
                <svg
                    className="ml-auto h-4 w-4 transition-transform
                     group-open:rotate-180 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
            </summary>

            <div className="mt-4 space-y-4 text-sm leading-relaxed">{children}</div>
        </details>
    );
}
