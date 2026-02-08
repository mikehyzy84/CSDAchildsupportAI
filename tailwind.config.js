/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: '#0A1628',
        teal: {
          DEFAULT: '#0EA5E9',
          light: '#7DD3FC'
        },
        slate: {
          DEFAULT: '#F1F5F9',
          dark: '#E2E8F0'
        },
        amber: {
          DEFAULT: '#F59E0B',
          500: '#F59E0B'
        },
        emerald: {
          DEFAULT: '#10B981',
          500: '#10B981',
          600: '#059669',
          700: '#047857'
        },
        // Legacy colors (keep for compatibility)
        'csdai-navy': '#0A1628',
        'csdai-sky': '#0EA5E9',
        'csdai-amber': '#F59E0B',
        'csdai-emerald': '#10B981',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out'
      }
    },
  },
  plugins: [],
};
