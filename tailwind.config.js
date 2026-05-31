/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: {
          base: '#0d1117',
          surface: '#161b22',
          elevated: '#21262d',
          overlay: '#30363d',
        },
        brand: {
          DEFAULT: '#7c3aed',
          light: '#8b5cf6',
          lighter: '#a78bfa',
          dark: '#6d28d9',
        },
        algo: {
          comparing:  '#fbbf24', // amber
          swapping:   '#f43f5e', // rose
          sorted:     '#34d399', // emerald
          pivot:      '#a78bfa', // violet
          found:      '#34d399', // emerald
          target:     '#f97316', // orange
          low:        '#60a5fa', // blue
          high:       '#f472b6', // pink
          mid:        '#fb923c', // orange
          visited:    '#1d4ed8', // blue
          path:       '#fbbf24', // amber
          current:    '#f97316', // orange
          start:      '#34d399', // emerald
          end:        '#f43f5e', // rose
          wall:       '#475569', // slate
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
