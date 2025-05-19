export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50:  '#eef3ff',
                    500: '#4f6af0',  // pick your own palette
                    900: '#1c2463',
                },
            },
            fontFamily: { mono: ['"Courier Prime"', 'ui-monospace', 'monospace'] }
        },
    },
    plugins: [],
};
