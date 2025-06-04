// src/pages/meta/Legal.jsx
import React, { useState, useEffect } from "react";
import withLayout from '../../hoc/withLayout.jsx';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Accordion({ title, content }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border rounded-lg mb-6 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center py-3 px-4 bg-gray-100 dark:bg-gray-800 font-medium text-left"
            >
                <span>{title}</span>
                <span className="text-xl">{open ? "−" : "+"}</span>
            </button>
            {open && (
                <div className="p-4 bg-white dark:bg-gray-900 prose max-w-none overflow-x-auto">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" />
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}

function Legal() {
    const [termsText, setTermsText] = useState("");
    const [privacyText, setPrivacyText] = useState("");
    const [cookiesText, setCookiesText] = useState("");

    useEffect(() => {
        fetch("/legal/terms.md")
            .then((res) => res.text())
            .then(setTermsText)
            .catch(() => setTermsText("Failed to load Terms & Conditions."));

        fetch("/legal/privacy.md")
            .then((res) => res.text())
            .then(setPrivacyText)
            .catch(() => setPrivacyText("Failed to load Privacy Policy."));

        fetch("/legal/cookies.md")
            .then((res) => res.text())
            .then(setCookiesText)
            .catch(() => setCookiesText("Failed to load Cookies Policy."));
    }, []);

    return (
        <main className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Legal</h1>

            <Accordion title="Terms & Conditions" content={termsText} />
            <Accordion title="Privacy Policy" content={privacyText} />
            <Accordion title="Cookies Policy" content={cookiesText} />
        </main>
    );
}

export default withLayout(Legal)