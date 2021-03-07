module.exports = {
  darkMode: "media",
  purge: ["./src/**/*.tsx", "./public/index.html"],
  theme: {
    fontFamily: {
      sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      // mono: ["Menlo", "Monaco", "Courier New", "monospace"],
    },
    colors: {
      "gray": {
        100: "#DEE3EA",
        200: "#B2BDCD",
        300: "#5D7290",
        // 400: "#4F617A",
        // 500: "#404F64",
        // 600: "#323D4D",
        700: "#242C37",
        800: "#151A21",
        900: "#0B0E11",
      },
      "doge-blood": {
        DEFAULT: "#FD4D4D",
        hover: "#FD6868"
      }
    },
    spacing: {
      "1": "5px",
      "2": "10px",
      "3": "15px",
      "4": "20px",
      "5": "30px",
      "6": "40px",
      "7": "60px",
    }
  },
  plugins: [],
};
