/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,vue,html}'],
  theme: {
    extend: {
      fontFamily: {
        chenyu: ['ChenYuluoyan', 'sans-sorif'],
      },
      boxShadow: {
        rb: '10px 10px 7px rgba(0, 0, 0, 0.25)',
        rt: '3px -2px 8px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        MyColor: {
          purple: '#9297C8',
          yellow: '#FBE7AB',
          pearl: '#C7DEEE',
        },
      },
      screens: {
        xs: '360px',
      },
      keyframes: {
        'bg-pulse': {
          '0%, 100%': { backgroundColor: '#fef2f2' }, // bg-red-100
          '50%': { backgroundColor: '#fecaca' }, // bg-red-300
        },
      },
      animation: {
        'bg-pulse': 'bg-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
