/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mmv: {
          red: "#ED0000",
          yellow: "#FDB813",
          black: "#111111",
          gray: "#F4F4F6",
          dark: "#1A1A1A",
        },
      },
    },
  },
  plugins: [],
};
