/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E9EEF3",
        "paper-dim": "#DCE3EA",
        ink: "#1D2B4F",
        "ink-soft": "#3C4A6E",
        stamp: "#C8442D",
        "stamp-dim": "#E2A89C",
        claim: "#1F6F5C",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
