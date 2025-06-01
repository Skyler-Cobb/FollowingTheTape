// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import CookieConsent from 'react-cookie-consent';
import './index.css';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function loadGA() {
    if (!GA_ID) return;
    // 1. inject gtag.js
    const s1 = document.createElement('script');
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    s1.async = true;
    document.head.appendChild(s1);

    // 2. initialize it
    const s2 = document.createElement('script');
    s2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { anonymize_ip: true });
  `;
    document.head.appendChild(s2);
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <App />

        {/* Cookie banner at the very root */}
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
                // clear any stray GA cookies
                document.cookie = '_ga=; Max-Age=0; path=/';
                document.cookie = '_gid=; Max-Age=0; path=/';
            }}
        >
            We use cookies for analytics to improve the site experience.
        </CookieConsent>
    </>
);
