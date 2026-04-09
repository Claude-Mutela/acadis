/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.edge",
    "./inertia/**/*.tsx",
    "./inertia/**/*.ts",
    "./inertia/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#F28C28',
          50: '#fff6ed',
          100: '#ffecd5',
          200: '#fdd3a8',
          300: '#F5B041',
          400: '#f39d34',
          500: '#F28C28',
          600: '#E67E22',
          700: '#c25c15',
          800: '#994815',
          900: '#7a3b14',
        },
        brand: {
          orange: '#F28C28',
          light: '#F5B041',
          wheat: '#F9E79F',
          dark: '#E67E22',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
