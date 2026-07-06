/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        warm: {
          primary: "#FF6B35",
          primaryDark: "#E55329",
          primaryLight: "#FFE5D9",
          amber: "#F59E0B",
          bg: "#FFF9F2",
          card: "#FFFFFF",
          text: "#1F1611",
          textSecondary: "#6B5544",
          textMuted: "#9C8B7A",
          border: "#F0E6DD",
          borderStrong: "#E8DDD3",
          health: "#7CB342",
          subtle: "#FFF5EE",
        },
      },
      boxShadow: {
        warm: "0 8px 30px rgba(255, 107, 53, 0.08)",
        "warm-lg": "0 20px 60px rgba(255, 107, 53, 0.10)",
      },
    },
  },
  plugins: [],
};
