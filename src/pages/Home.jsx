// src/pages/Home.jsx
import React from 'react';
import CookieConsent from 'react-cookie-consent';
import withLayout from '../hoc/withLayout.jsx';
import BlogFeed from '../components/BlogFeed.jsx';

// Replace with your actual Vite env var key
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function loadGA() {
    if (!GA_ID) return;

    // Load the gtag script
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script1.async = true;
    document.head.appendChild(script1);

    // Initialize GA after script loads
    const script2 = document.createElement('script');
    script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}  
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `;
    document.head.appendChild(script2);
}

function Home() {
    return (
        <>
            {/* page title */}
            <h1 className="mb-6 text-center text-3xl font-semibold">
                Following&nbsp;The&nbsp;Tape
            </h1>

            {/* Page intro */}
            <section className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row">
                {/* text blurb */}
                <article className="flex-1 space-y-4 leading-relaxed">
                    <p>
                        Welcome to <strong>Following&nbsp;The&nbsp;Tape</strong>, a fan-built
                        resource built to compile and track information related to the
                        “Follow&nbsp;the&nbsp;Tape” ARG from the <em> it’s getting late… </em> YouTube channel.
                    </p>

                    <p>
                        Here you’ll find information about the arg's universe, tools, transcripts,
                        hints for those who'd like guidance but not full answers, and
                        links to other places where the mystery is being unravelled.
                    </p>

                    <p>Enjoy your stay, and don’t forget…</p>
                </article>
            </section>

            {/* latest blog posts -- commented out for now as it's busted

      <section className="mx-auto max-w-4xl px-4">
          <BlogFeed />
      </section>

      */}

            {/* Cookie consent banner */}
            <CookieConsent
                location="bottom"
                buttonText="Accept"
                declineButtonText="Decline"
                enableDeclineButton
                cookieName="ftt_consent"
                style={{ background: '#2B373B' }}
                buttonStyle={{ color: '#fff', fontSize: '14px' }}
                declineButtonStyle={{ color: '#fff', fontSize: '14px' }}
                onAccept={loadGA}
                onDecline={() => {
                    // Optionally clear any existing GA cookies
                    document.cookie = '_ga=; Max-Age=0; path=/';
                    document.cookie = '_gid=; Max-Age=0; path=/';
                }}
            >
                We use cookies for analytics to improve the site experience.
            </CookieConsent>
        </>
    );
}

export default withLayout(Home);
