module.exports = {
  darkMode: "media",
  purge: ["./src/**/*.tsx", "./public/index.html"],
  theme: {
    fontFamily: {
      sans: ["Heebo", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      mono: ["Menlo", "Monaco", "Courier New", "monospace"],
    },
    extend: {
      colors: {
        "simple-gray": { // extracted from the old code
          "1e": "#1e1e1e",
          "23": "#232323",
          "26": "#262626",
          "2b": "#2b2b2b",
          "33": "#333333",
          "3a": "#3a3d41", // meh
          "3c": "#3c3c3c",
          "3d": "#3d3d3d",
          "45": "#45494e", // meh
          "4d": "#4d4d4d",
          "59": "#595959",
          "69": "#696969",
          "80": "#808080",
          "8c": "#8c8c8c",
          "9c": "#9ca38f", // meh
          "a6": "#a6a6a6",
          "d9": "#d9d9d9",
          "fe": "#fefefe",
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [],
};
