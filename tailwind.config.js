/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#5D5DFF", // Morphic primary color
        secondary: "#111827", // Dark background
        accent: "#F9FAFB", // Light background
        highlight: "#6366F1", // Indigo highlight color
        muted: "#6B7280", // Gray for muted text
        success: "#10B981", // Green for success states
        warning: "#FBBF24", // Amber for warnings
        danger: "#EF4444", // Red for errors
        morphic: {
          dark: "#0A0A0A", // Morphic dark background
          darker: "#050505", // Even darker background
          light: "#F5F5F5", // Light text
          accent: "#5D5DFF", // Accent color
          gray: "#1A1A1A", // Gray background
          lightgray: "#2A2A2A", // Lighter gray
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.08)",
        hover: "0 10px 40px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [scrollbarHide],
};
