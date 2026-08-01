/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A1A2F',
          800: '#0F2338',
          700: '#152C43',
          600: '#1C3A54',
        },
        sand: {
          DEFAULT: '#FBF7F0',
          100: '#FFFFFF',
          200: '#F5EFE3',
          300: '#ECE3D5',
        },
        horizon: {
          50: '#EEF9FA',
          100: '#D3EFF0',
          300: '#7FC7CB',
          500: '#0E7490',
          600: '#0B5D74',
          700: '#094A5D',
          900: '#062F3A',
        },
        sunset: {
          400: '#FF8A65',
          500: '#F4623A',
          600: '#D94E29',
        },
        mist: {
          400: '#93A5B8',
          500: '#7086A0',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'horizon-gradient': 'linear-gradient(135deg, #0E7490 0%, #062F3A 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FF8A65 0%, #F4623A 100%)',
        'dusk-gradient': 'linear-gradient(180deg, #0A1A2F 0%, #0E7490 140%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(10, 26, 47, 0.15)',
        'glass-lg': '0 20px 60px -10px rgba(10, 26, 47, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'dash-flow': {
          to: { strokeDashoffset: '-24' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'dash-flow': 'dash-flow 1.2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
