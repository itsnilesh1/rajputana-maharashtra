/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          black: '#0A0A0B',
          charcoal: '#111114',
          dark: '#1A1A1F',
          maroon: '#7B1C2C',
          crimson: '#9B1D30',
          red: '#C41E3A',
          gold: '#C9A84C',
          amber: '#E8C45A',
          light: '#F5D98A',
          cream: '#FFF8E7',
          ivory: '#FFFFF0',
        }
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'serif'],
        serif: ['var(--font-crimson)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #0A0A0B 0%, #1A1A1F 50%, #0A0A0B 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C45A 50%, #C9A84C 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #7B1C2C 0%, #9B1D30 50%, #7B1C2C 100%)',
        'hero-pattern': "url('/images/pattern.svg')",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      boxShadow: {
        'royal': '0 0 30px rgba(201, 168, 76, 0.15)',
        'royal-lg': '0 0 60px rgba(201, 168, 76, 0.2)',
        'maroon': '0 0 30px rgba(123, 28, 44, 0.3)',
      },
      borderColor: {
        'gold': '#C9A84C',
        'gold-dim': 'rgba(201, 168, 76, 0.3)',
      }
    },
  },
  plugins: [],
}
