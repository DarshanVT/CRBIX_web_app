/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.6s ease-out forwards",
      },},
  },
  plugins: [],

  fontFamily: {
    heading: ['Abril Fatface', 'serif'],
    body: ['Inter', 'sans-serif'],
  }
}

