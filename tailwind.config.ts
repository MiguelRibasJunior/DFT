import type { Config } from 'tailwindcss';

export default {
  content: [
    './resources/views/**/*.blade.php',
    './resources/js/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        dft: {
          bg: {
            primary: '#080B14',
            secondary: '#101524',
            tertiary: '#161E34',
            card: 'rgba(16, 21, 36, 0.7)',
            'card-hover': 'rgba(22, 30, 52, 0.95)',
          },
          accent: {
            blue: '#2388FF',
            cyan: '#28D7E5',
            purple: '#7B4DFF',
            green: '#22D18A',
            warning: '#F5C842',
            danger: '#F04E37',
          },
          text: {
            white: '#F5F7FA',
            gray: '#AAB2C0',
            muted: '#6B768C',
          },
          border: {
            gray: '#293247',
            glow: 'rgba(40, 215, 229, 0.4)',
            'glow-purple': 'rgba(123, 77, 255, 0.4)',
            'glow-blue': 'rgba(35, 136, 255, 0.4)',
          },
        },
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(40, 215, 229, 0.35)',
        'glow-cyan-lg': '0 0 45px rgba(40, 215, 229, 0.5)',
        'glow-blue': '0 0 25px rgba(35, 136, 255, 0.35)',
        'glow-purple': '0 0 25px rgba(123, 77, 255, 0.35)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'inner-glow': 'inset 0 0 15px rgba(40, 215, 229, 0.2)',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #2388FF 0%, #28D7E5 50%, #7B4DFF 100%)',
        'gradient-text': 'linear-gradient(135deg, #F5F7FA 0%, #28D7E5 50%, #2388FF 100%)',
        'gradient-purple-cyan': 'linear-gradient(135deg, #7B4DFF 0%, #28D7E5 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(35, 136, 255, 0.08) 0%, rgba(123, 77, 255, 0.03) 100%)',
        'gradient-radial-glow': 'radial-gradient(circle at 50% 0%, rgba(40, 215, 229, 0.15) 0%, transparent 70%)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        'glass-lg': '24px',
      },
    },
  },
  plugins: [],
} satisfies Config;
