/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-lime": "#abde64",
        "custom-input-bg": "#1e2939",
      },
    },
  },
  plugins: [],
};
