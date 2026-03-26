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
          DEFAULT: '#eb9e04',
          50: '#fdf8ec',
          100: '#f8ead0',
          200: '#f2d3a1',
          300: '#ebb869',
          400: '#eb9e04',
          500: '#ce8100',
          600: '#aa5e00',
          700: '#864100',
          800: '#673100',
          900: '#562800',
        },
        brand: {
          orange: '#eb9e04',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
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
