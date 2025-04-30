import React, { useEffect } from 'react'
import Banner from './Banner'
import Navbar from './Navbar'

export default function Layout({ children, title }) {
    useEffect(() => {
        document.title = title || 'Following The Tapes'
    }, [title])

    return (
        <div className="flex h-screen flex-col">
            {/* ── Fixed header ─────────────────────────────────────── */}
            <header className="flex-shrink-0 w-full">
                <Banner />
                <Navbar />
            </header>

            {/* ── Main content (fills remaining space) ─────────────── */}
            <main className="flex flex-1 w-full overflow-hidden p-4">
                {children}
            </main>
        </div>
    )
}
