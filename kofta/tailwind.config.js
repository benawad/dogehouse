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
        "vsc-bg": "#1e1e1e",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
