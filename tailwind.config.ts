import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'rgba(255,255,255,0.1)',
        background: '#0b0f1a',
        foreground: '#f8fafc'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        glass: '0 10px 30px rgba(0,0,0,0.5)'
      }
    }
  },
  plugins: []
}

export default config

