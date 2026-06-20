module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#06101f', 800: '#0a1628', 700: '#0f2550', 600: '#1a3a6b' },
        gold: { 400: '#f0c040', 500: '#e8a020', 600: '#c06010' },
        teal: { 400: '#5de0ea', 500: '#0d7e8a', 600: '#065a66' }
      },
      fontFamily: {
        display: ["'Playfair Display'", 'serif'],
        body: ["'DM Sans'", 'sans-serif'],
        mono: ["'Space Mono'", 'monospace']
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease both',
        'fade-in': 'fadeIn 0.5s ease both',
        'slide-down': 'slideDown 0.3s ease',
        'pulse-slow': 'pulse 3s infinite'
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #06101f 0%, #0f2550 40%, #0a3d62 70%, #052938 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
      }
    }
  },
  plugins: []
};
