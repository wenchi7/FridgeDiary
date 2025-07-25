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
      },
      colors: {
        MyColor: {
          purple: '#9297C8',
          yellow: '#FBE7AB',
        },
      },
    },
  },
  plugins: [],
}
