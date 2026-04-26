import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F2EBDD',
          300: '#E8DDC8',
        },
        ink: {
          900: '#1F1A15',
          800: '#2A1F1A',
          700: '#3D332B',
          500: '#6B5D52',
          400: '#8A7C70',
        },
        terracotta: {
          400: '#D08D80',
          500: '#C4756B',
          600: '#A85E55',
          700: '#8A4A42',
        },
        sage: {
          500: '#8FA388',
          600: '#6F8568',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
