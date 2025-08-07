/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'oklch(0.90 0.08 180)',
          500: 'oklch(0.45 0.15 180)',
          600: 'oklch(0.40 0.15 180)',
        },
        secondary: {
          50: 'oklch(0.98 0.02 210)',
          100: 'oklch(0.95 0 0)',
          500: 'oklch(0.85 0.05 210)',
        },
        accent: {
          500: 'oklch(0.70 0.15 50)',
          600: 'oklch(0.65 0.15 50)',
        },
        gray: {
          50: 'oklch(0.98 0.02 210)',
          100: 'oklch(0.95 0 0)',
          900: 'oklch(0.15 0 0)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
