/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        fontFamily: {
          fontf1: ["Edu AU VIC WA NT Arrows", 'cursive'],
        },
      }
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
  ],
};
