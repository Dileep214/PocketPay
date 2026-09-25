/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb', // Primary Blue: Trustworthy, High Contrast
          600: '#1d4ed8',
          700: '#1e40af',
        },
        success: {
          500: '#16a34a', // Emerald Green: For Pay, Hired, Immediate
          600: '#15803d',
        }
      }
    },
  },
  plugins: [],
}
