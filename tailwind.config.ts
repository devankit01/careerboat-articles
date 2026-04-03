import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sand: '#eef2f7',
        ink: '#22232b',
        ember: '#4f46e5',
        clay: '#5f6678',
        butter: '#f2cc59',
        lilac: '#e7e5ff',
        line: '#d5d9e3'
      },
      fontFamily: {
        sans: ['var(--font-figtree)'],
        ivy: ['var(--font-ivy)'],
      }
    }
  },
  plugins: []
};

export default config;
