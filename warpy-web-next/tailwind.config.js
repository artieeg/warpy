module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: '"MontserratAlternates-ExtraBold", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      },
      fontSize: {
        xxs: ['0.625rem', '0.75rem'],
      },
      colors: {
        black: "#000000",
        mine_shaft: "#303030",
        cod_gray: "#101010",
        white: "#fefefe",
        green: "#BDF971",
        yellow: "#F9F871",
        red: "#F97971",
        boulder: "#7b7b7b",
        blue: "#71A7F9",
        orange: "#F9AA71",
      },
    },
  },
  plugins: [],
};
