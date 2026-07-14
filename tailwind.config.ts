import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette Nihary — jaune-brun SHS
        nihary: {
          or:       '#E8A020', // Jaune doré principal
          'or-clair': '#F5C85A', // Jaune clair
          'or-pale':  '#FBF0D0', // Fond sable très clair
          ambre:    '#7A4A10', // Brun ambre
          'ambre-fonce': '#3D2008', // Brun profond
          sable:    '#F5EDD8', // Beige sable fond
          'sable-fonce': '#E8DCC0', // Sable medium
          ecru:     '#FEFAF3', // Blanc cassé fond page
          brun:     '#5C3A1E', // Brun texte
          gris:     '#8C7A5E', // Gris-brun muted
          'gris-clair': '#C4B49A', // Gris très clair
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'nihary-gradient': 'linear-gradient(135deg, #F5EDD8 0%, #FBF0D0 50%, #FEFAF3 100%)',
        'or-gradient': 'linear-gradient(90deg, #E8A020 0%, #F5C85A 100%)',
      },
      boxShadow: {
        'nihary-sm': '0 1px 3px rgba(61, 32, 8, 0.08)',
        'nihary-md': '0 4px 16px rgba(61, 32, 8, 0.10)',
        'nihary-lg': '0 8px 32px rgba(61, 32, 8, 0.12)',
      },
      borderRadius: {
        'nihary': '6px',
      },
    },
  },
  plugins: [],
}

export default config
