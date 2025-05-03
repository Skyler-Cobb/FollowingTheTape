// src/components/ErrorBoundary.jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                    ⚠️ Something went wrong with the spectrogram viewer.
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-2 underline hover:text-red-800"
                    >
                        Try reloading
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}