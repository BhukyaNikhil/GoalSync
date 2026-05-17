module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 20px 80px rgba(15, 23, 42, 0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(59,130,246,0.35), transparent 35%), radial-gradient(circle at bottom right, rgba(236,72,153,0.22), transparent 30%)',
      },
      colors: {
        'navy-900': '#0f172a',
        'navy-800': '#111827',
        'navy-700': '#1e293b',
        brand: '#2563eb',
      },
    },
  },
  plugins: [],
};
