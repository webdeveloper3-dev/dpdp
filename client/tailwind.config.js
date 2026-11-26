/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0b0f19",
        surface: "#111827",
        card: "#161f30",
        borderline: "#253349",
        accent: "#38bdf8"
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
        md: "2px",
        lg: "2px"
      }
    }
  },
  plugins: []
};
