/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F9FBFF",
        primary: "#FF7474",
        secondary: "#FF9F43",
        accent: "#55A6CE",
      },
    },
  },
  plugins: [],
}