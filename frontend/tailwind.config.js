/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#ff007a',
        'text-primary': '#1a1a1a',
        'text-secondary': '#757575',
        'bg-light': '#f8f8f8',
        'bg-white': '#ffffff',
        'border-color': '#e0e0e0',
        error: '#ff3b30',
        success: '#34c759',
      },
      fontFamily: {
        main: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      maxWidth: {
        'container': '1600px',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        ticker: 'ticker 20s linear infinite',
      }
    },
  },
  plugins: [],
}
