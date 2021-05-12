/* eslint-disable global-require */
module.exports = {
  darkMode: "class",
  purge: {
    content: ["./src/**/*.tsx", "./public/index.html"],
    options: {
      safelist: ["h-8", "h-11"],
    },
  },
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
      mono: ["Menlo", "Monaco", "Courier New", "monospace"],
    },
    fontSize: {
      tiny: "0.625rem",
      xs: ".75rem",
      sm: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    colors: {
      button: "var(--color-button-text)",
      transparent: "transparent",
      primary: {
        100: "var(--color-primary-100)",
        200: "var(--color-primary-200)",
        300: "var(--color-primary-300)",
        600: "var(--color-primary-600)",
        700: "var(--color-primary-700)",
        800: "var(--color-primary-800)",
        900: "var(--color-primary-900)",
      },
      secondary: {
        DEFAULT: "var(--color-secondary)",
        "washed-out": "var(--color-secondary-washed-out)",
      },
      accent: {
        DEFAULT: "var(--color-accent)",
        hover: "var(--color-accent-hover)",
        disabled: "var(--color-accent-disabled)",
      },
      black: "#000",
    },
    spacing: {
      0: "0px",
      1: "5px",
      1.5: "6px",
      2: "10px",
      3: "15px",
      4: "20px",
      4.5: "25px",
      5: "30px",
      5.5: "35px",
      6: "40px",
      6.5: "50px",
      7: "60px",
      7.5: "65px",
      8: "75px",
      9: "80px",
      10: "90px",
      11: "100px",
      15: "150px",
      "5l": "10rem",
      "n1/2": "-50%",
      24: "24rem",
      400: "400px",
    },

    boxShadow: {
      outlineLg: "0 0 0 4pt var(--color-primary-800)",
      outlineMd: "0 0 0 2pt var(--color-primary-800)",
      outlineSm: "0 0 0 1pt var(--color-primary-800)",
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0px",
      4: "4px",
      2: "2px",
    },
    extend: {
      borderRadius: {
        5: "5px",
        8: "8px",
        20: "20px",
        40: "40px",
      },
      borderColor: {
        "color-800": "var(--color-primary-800)",
      },
      outline: {
        "no-chrome": "none",
      },
      transitionTimingFunction: {
        "in-out-hard": "cubic-bezier(.77, 0, .175, 1)",
      },
      transitionDuration: {
        400: "400ms",
      },
      keyframes: {
        breathe: {
          "0%, 100%": {
            boxShadow: "0 0 20px 2px var(--color-primary-100-translucent)",
            borderColor: "var(--color-primary-300)",
          },
          "50%": {
            boxShadow: "0 0 20px 2px transparent",
            borderColor: "var(--color-primary-700)",
          },
        },
      },
      animation: {
        "breathe-slow": "breathe 5s infinite ease-in-out",
      },
    },
  },
  variants: {
    backgroundColor: ({ after }) => after(["disabled"]),
    textColor: ({ after }) => after(["disabled"]),
    scrollbar: ["rounded", "dark"],
    extend: {
      borderWidth: ["last"],
    },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/line-clamp")],
};
