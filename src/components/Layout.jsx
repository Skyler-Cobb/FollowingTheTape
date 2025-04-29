import React, { useEffect } from 'react'
import Banner from './Banner'
import Navbar from './Navbar'

const Layout = ({ children, title }) => {
    useEffect(() => {
        document.title = title || 'Following The Tapes'
    }, [title])

    return (
        <>
            <header className="w-full">
                <Banner />
                <Navbar />
            </header>

            {/* main content area */}
            <main className="mx-auto max-w-7xl p-4">{children}</main>
        </>
    )
}

export default Layout
