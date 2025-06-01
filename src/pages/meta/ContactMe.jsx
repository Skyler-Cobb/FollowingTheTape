// ContactMe.jsx
import React, { useState } from 'react';
import withLayout from '../../hoc/withLayout.jsx';

const PAGE_TITLE = 'Contact Me';
const FORMSPREE_URL = 'https://formspree.io/f/xanjyyez';

function ContactMe() {
    const [status, setStatus] = useState(''); // '', 'SUCCESS', 'ERROR'

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus(''); // clear feedback

        const formData = new FormData(event.target);
        try {
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });
            if (response.ok) {
                setStatus('SUCCESS');
                event.target.reset();
            } else {
                setStatus('ERROR');
            }
        } catch (err) {
            setStatus('ERROR');
        }
    };

    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
            <h1 className="text-4xl font-bold tracking-tight">{PAGE_TITLE}</h1>
            <p className="text-gray-400 text-lg text-center max-w-xl">
                If you’d like to get in touch, please fill out the form below and I’ll
                respond as soon as possible.
            </p>

            {/* Feedback messages */}
            {status === 'SUCCESS' && (
                <div className="w-full max-w-xl bg-green-800 border border-green-700 text-green-200 px-4 py-3 rounded">
                    Thank you for your message! I’ll get back to you shortly.
                </div>
            )}
            {status === 'ERROR' && (
                <div className="w-full max-w-xl bg-red-800 border border-red-700 text-red-200 px-4 py-3 rounded">
                    Oops—something went wrong. Please try again in a few minutes.
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-200 font-medium mb-1">
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-200 font-medium mb-1">
                        Your Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="message"
                        className="block text-gray-200 font-medium mb-1"
                    >
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="6"
                        required
                        placeholder="Type your message here..."
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="mx-auto block bg-gray-700 border-2 border-gray-500 text-white rounded px-4 py-2 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    Send Message
                </button>
            </form>
        </main>
    );
}

export default withLayout(ContactMe);
