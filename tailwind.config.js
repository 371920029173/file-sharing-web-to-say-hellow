/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ad-fade': {
          '0%, 25%': { opacity: '1' },
          '30%, 55%': { opacity: '0' },
          '60%, 85%': { opacity: '0' },
          '90%, 100%': { opacity: '1' },
        },
      },
      animation: {
        'gradient': 'gradient-shift 8s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'ad-fade': 'ad-fade 6s ease-in-out infinite',
      },
      backgroundSize: { '200%': '200%' },
    },
  },
  plugins: [],
}
