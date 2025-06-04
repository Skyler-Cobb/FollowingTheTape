import React from 'react';
import { Link } from 'react-router-dom';
import withLayout from '../hoc/withLayout.jsx';

function NotFound() {
    return (
        <section className="flex flex-col items-center gap-8 py-16 text-center">
            {/* illustration */}
            <img
                src="/assets/svg/notfound.svg"
                alt="Lost tape illustration"
                className="h-48 w-auto"
            />

            {/* big status code */}
            <h1 className="text-6xl font-bold tracking-widest text-brand-500 drop-shadow">
                404 – Page Not Found
            </h1>

            {/* short explanation */}
            <p className="max-w-xl text-lg leading-relaxed">
                Sorry, but the page you’re looking for went missing in the dead of night.
                It might have been moved, removed, or you may have followed a bad link.
            </p>

            {/* primary action */}
            <Link
                to="/"
                className="rounded-md bg-brand-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-600"
            >
                Take&nbsp;me&nbsp;home
            </Link>
        </section>
    );
}

export default withLayout(NotFound);
