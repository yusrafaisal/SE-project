/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#fdfaf4',
          100: '#f9f3e3',
          200: '#f2e5c4',
        },
        ember: {
          400: '#e8845a',
          500: '#d96b3f',
          600: '#c45a2e',
        },
        forest: {
          700: '#2d4a3e',
          800: '#1e3329',
          900: '#111f18',
        },
        charcoal: '#1a1a1a',
        'warm-gray': '#8a8278',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
