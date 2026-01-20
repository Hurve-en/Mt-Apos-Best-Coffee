import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#fcf9f4",
          100: "#f9f1e8",
          200: "#f2e4d5",
          300: "#e8d5c4",
          400: "#d4a574",
          500: "#c89a6f",
          600: "#b8845a",
          700: "#8b6f47",
          800: "#5c4933",
          900: "#3e2723",
        },
        warm: {
          50: "#fff8f3",
          100: "#ffe6d5",
          200: "#ffd9ba",
          300: "#f5c99e",
          400: "#e8b887",
          500: "#d9a574",
          600: "#ca9360",
          700: "#b8804d",
          800: "#9d6b3a",
          900: "#845627",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
