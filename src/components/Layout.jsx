import React, { useEffect } from 'react'
import Banner from './Banner'
import Navbar from './NavBar'

export default function Layout({ children, title, layoutOpts = {} }) {
    const { fullWidth = false, flex = false } = layoutOpts

    useEffect(() => {
        document.title = title || 'Following The Tape'
    }, [title])

    /* build <main> class list */
    const mainClasses = [
        flex && 'flex',                // side-by-side scrolling panes (e.g. Transcripts)
        'w-full p-4 overflow-auto',  // always
        fullWidth ? 'flex-1' : 'flex-1 mx-auto max-w-7xl', // centred vs full-bleed
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex-shrink-0 w-full">
                <Banner />
                <Navbar />
            </header>

            <main className={mainClasses}>{children}</main>
        </div>
    )
}
