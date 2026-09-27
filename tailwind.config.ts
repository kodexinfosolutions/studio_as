import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b0c',
        paper: '#f7f5f1',
        gold: '#b89355',
        muted: '#8a8a8a',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      letterSpacing: { widest2: '0.35em' },
    },
  },
  plugins: [],
};
export default config;
