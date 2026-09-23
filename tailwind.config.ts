import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#5B0B24',
          pink: '#C2185B',
          coral: '#FF4F7A',
          orange: '#FF7A3D',
          golden: '#FFC83D',
          bg: '#FFF7FA',
        },
        primary: {
          DEFAULT: '#5B0B24',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        card: '24px',
        input: '18px',
        button: '20px',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(91, 11, 36, 0.06)',
        hover: '0 20px 40px rgba(91, 11, 36, 0.12)',
        sunset: '0 10px 25px -5px rgba(255, 79, 122, 0.3)',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
