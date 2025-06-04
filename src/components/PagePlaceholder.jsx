// src/components/PagePlaceholder.jsx
import React from 'react';

/**
 * PagePlaceholder
 * -------------------------------------------
 * Props
 *  • title    – <string> page heading           (required)
 *  • message  – <string> secondary blurb text   (optional)
 *  • svgPath  – <string> path to an illustration (optional)
 *               defaults to the blueprint SVG
 *  • className – <string> extra tailwind classes (optional)
 */
export default function PagePlaceholder({
                                            title,
                                            message = 'This page is still under construction. Check back later!',
                                            svgPath = '/assets/svg/blueprint.svg',
                                            className = '',
                                        }) {
    return (
        <main
            className={`flex min-h-[60vh] flex-col items-center justify-center gap-6 ${className}`}
        >
            {/* Illustration */}
            <img
                src={svgPath}
                alt="Under construction illustration"
                className="h-40 w-auto"
            />

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

            {/* Message */}
            <p className="text-lg text-gray-600 text-center max-w-md">{message}</p>
        </main>
    );
}
