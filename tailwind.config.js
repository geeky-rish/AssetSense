/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-dark': '#0f1115',
                // ... I can rely on the CSS variables or add them here if needed, but for now getting basic tailwind working is priority.
                // Actually, I should probably expose the custom colors to Tailwind if I want to use 'bg-bg-dark' etc, 
                // but the current CSS uses standard classes like 'bg-gray-900' mixed with custom CSS. 
                // Let's stick to the basic config first.
            },
        },
    },
    plugins: [],
}
