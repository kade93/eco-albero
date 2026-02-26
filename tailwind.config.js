/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./app.jsx",
    ],
    theme: {
        extend: {
            colors: {
                'catalog-bg': '#f5f4ef',
                'catalog-brand': '#5d7c47',
                'catalog-gold': '#c5a059',
                'catalog-dark': '#2c2c2c',
                'catalog-accent': '#e5e1d3',
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
