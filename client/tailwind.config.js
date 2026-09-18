/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        randere: {
          black: '#0A0A0B',
          dark: '#111113',
          card: '#161619',
          border: '#242429',
          muted: '#808086',
          chalk: '#F4F4F2',
          bone: '#E5E5E0',
          accent: '#CCFF00', // Acid Volt
          orange: '#FF4800', // Scarcity orange
          cobalt: '#2E5BFF',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.15em',
        mega: '0.25em',
      },
    },
  },
  plugins: [],
}
