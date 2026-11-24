/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FFF5F8',
          100: '#FFE4EE',
          200: '#FFCCD9',
          300: '#FFAEC2',
          400: '#F48BA7',
        },
        lavender: {
          50: '#F8F5FF',
          100: '#EDE4FF',
          200: '#DCCBFF',
          300: '#C7ADFF',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FFF9F6',
          200: '#FFF2EB',
          300: '#FFE5D9',
        },
        rosegold: {
          DEFAULT: '#D48C9E',
          light: '#E5A9B8',
          dark: '#B86F81',
          shimmer: '#F9CCD6',
        },
        plum: {
          DEFAULT: '#4A2C3A',
          light: '#6E4559',
          dark: '#301824',
          muted: '#8A6878',
        },
        peach: {
          100: '#FFEAD9',
          200: '#FFD7BC',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        sans: ['"Quicksand"', '"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 8px 32px 0 rgba(212, 140, 158, 0.18)',
        'rose-glow': '0 0 25px rgba(229, 169, 184, 0.45)',
        'float': '0 10px 30px -10px rgba(74, 44, 58, 0.15)',
        'glass': '0 8px 32px 0 rgba(212, 140, 158, 0.12)',
        'inner-light': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'flicker': 'flicker 1.5s infinite alternate ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flicker: {
          '0%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08) rotate(1.5deg)', opacity: '1' },
          '100%': { transform: 'scale(0.95) rotate(-0.5deg)', opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
