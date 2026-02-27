/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary analyst palette
        surface: {
          900: 'var(--iw-bg)',
          800: 'var(--iw-surface)',
          700: 'color-mix(in srgb, var(--iw-text) 12%, var(--iw-surface))',
          600: 'color-mix(in srgb, var(--iw-text) 20%, var(--iw-surface))',
          500: 'color-mix(in srgb, var(--iw-text) 30%, var(--iw-surface))',
        },
        accent: {
          DEFAULT: 'var(--iw-accent)',
          50: 'color-mix(in srgb, var(--iw-accent) 5%, var(--iw-bg))',
          100: 'color-mix(in srgb, var(--iw-accent) 10%, var(--iw-bg))',
          200: 'color-mix(in srgb, var(--iw-accent) 20%, var(--iw-bg))',
          300: 'color-mix(in srgb, var(--iw-accent) 40%, var(--iw-bg))',
          400: 'color-mix(in srgb, var(--iw-accent) 80%, var(--iw-bg))',
          500: 'var(--iw-accent)',
          600: 'color-mix(in srgb, var(--iw-accent) 80%, black)',
          700: 'color-mix(in srgb, var(--iw-accent) 60%, black)',
          800: 'color-mix(in srgb, var(--iw-accent) 40%, black)',
          900: 'color-mix(in srgb, var(--iw-accent) 30%, black)',
        },
        intel: {
          green: '#22c55e',
          red: '#ef4444',
          amber: '#f59e0b',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
