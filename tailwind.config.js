/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        burgundy: {
          50: '#fdf2f4',
          100: '#fbe5e8',
          200: '#f7ccd3',
          300: '#ee9ca9',
          400: '#e16377',
          500: '#d03750',
          600: '#b4213a',
          700: '#8f172b',
          800: '#691624',
          900: '#4a1525',
          950: '#2b0711',
        },
        gold: {
          50: '#fffdf5',
          100: '#fff9df',
          200: '#fff0b3',
          300: '#ffe27d',
          400: '#ffd043',
          500: '#e5b326',
          600: '#c59218',
          700: '#9d6d13',
          800: '#815616',
          900: '#6c4617',
          950: '#3f2509',
        },
        champagne: {
          DEFAULT: '#F7E7CE',
          light: '#FFF8ED',
          dark: '#E2CEB1',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        handwriting: ['Dancing Script', 'Great Vibes', 'cursive'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'romantic': '0 20px 40px -15px rgba(143, 23, 43, 0.25)',
        'glow-gold': '0 0 25px rgba(229, 179, 38, 0.35)',
        'glow-rose': '0 0 25px rgba(225, 29, 72, 0.35)',
      }
    },
  },
  plugins: [],
}
