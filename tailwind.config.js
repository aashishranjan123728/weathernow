/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        weather: {
          bg: {
            dark: '#0B1120',
            darker: '#060A12',
            card: 'rgba(15, 23, 42, 0.65)',
            lightCard: 'rgba(255, 255, 255, 0.75)',
          },
          accent: {
            blue: '#38BDF8',
            indigo: '#6366F1',
            purple: '#A855F7',
            cyan: '#06B6D4',
            sun: '#F59E0B',
            rain: '#3B82F6',
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

