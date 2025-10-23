// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        primary: {
          DEFAULT: '#212125', // cor principal para paineis
          foreground: '#D9D9D9', // texto em cima da cor primaria
          backgroundClaro: '#ffffffff',
          backgroundCard: '#b33030ff',
        },
        secondary: '#3E444A',
        accent: {
          DEFAULT: '#2A4B42', // a cor de destaque
          foreground: '#FFFFFF', // texto em cima do destaque
        },
        muted: '#D9D9D9',
      }
    },
  },
  plugins: [],
};