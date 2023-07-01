/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Noto Sans"],
    },
    extend: {
      colors: {
        primary: "#6C40B5",
        slate: "#666666",
        "white-20": "rgba(255, 255, 255, 0.2)",
        "white-30": "rgba(255, 255, 255, 0.3)",
        "white-40": "rgba(255, 255, 255, 0.4)",
        "white-50": "rgba(255, 255, 255, 0.5)",
      },
    },
  },
  plugins: [],
};
