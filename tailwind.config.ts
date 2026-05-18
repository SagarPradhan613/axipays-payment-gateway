import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'axipays-bg': {
          dark: '#0F0F0F',
          light: '#FAFAF7',
        },
        'axipays-surface': {
          dark: '#1A1A1A',
          light: '#FFFFFF',
        },
        'axipays-row': {
          dark: '#1F1F1F',
          light: '#FAFAF7',
        },
        'axipays-text': {
          dark: '#F5F0E8',
          light: '#0F0F0F',
        },
        'axipays-muted': {
          dark: '#9E9E9E',
          light: '#6B6B6B',
        },
        'axipays-border': {
          dark: 'rgba(255,255,255,0.08)',
          light: 'rgba(0,0,0,0.08)',
        },
        'axipays-primary': '#7C3AED',
        'axipays-primary-hover': '#8B5CF6',
        'axipays-gold': '#D4A847',
        'axipays-success': '#10B981',
        'axipays-failed': '#F43F5E',
        'axipays-pending': '#F59E0B',
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        success: '#10B981',
        danger: '#F43F5E',
        warning: '#F59E0B',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        app: 'rgb(var(--color-background) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        ink: 'rgb(var(--color-text-primary) / <alpha-value>)',
        muted: 'rgb(var(--color-text-secondary) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Inter', 'ui-serif', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 20px 48px rgba(15, 15, 15, 0.08)',
        glow: '0 18px 40px rgba(124, 58, 237, 0.18)',
        violet: '0 0 0 3px rgba(124, 58, 237, 0.3)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(124,58,237,0.12), transparent 34%), radial-gradient(circle at bottom right, rgba(212,168,71,0.08), transparent 28%)',
      },
      borderRadius: {
        '4xl': '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
