/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EEF3F7",
        "paper-dim": "#DDE6EE",
        ink: "#0C2340",
        "ink-soft": "#2C6694",
        stamp: "#0A0A0A",
        "stamp-dim": "#4A90D9",
        claim: "#4A90D9",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
