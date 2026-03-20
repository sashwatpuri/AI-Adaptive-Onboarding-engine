/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0d0e12',
        'surface': '#0d0e12',
        'surface-container-low': '#121318',
        'surface-container': '#18191e',
        'surface-container-high': '#1e1f25',
        'surface-container-highest': '#24252b',
        'primary': '#ba9eff',
        'primary-dim': '#8455ef',
        'secondary': '#34b5fa',
        'tertiary': '#f673b7',
        'error': '#ff6e84',
        'on-surface': '#faf8fe',
        'on-surface-variant': '#abaab0',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
