import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: "#0B0F19",
          card: "#131B2E",
          "card-hover": "#1A243F",
          border: "#2A3656",
          gold: "#F59E0B",
          "gold-hover": "#D97706",
          "gold-light": "#FDE68A",
          crimson: "#991B1B",
          emerald: "#059669",
          blue: "#2563EB",
          purple: "#7C3AED",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(245, 158, 11, 0.35)",
        "crimson-glow": "0 0 20px rgba(239, 68, 68, 0.35)",
        "emerald-glow": "0 0 20px rgba(16, 185, 129, 0.35)",
        "active-turn": "0 0 25px rgba(245, 158, 11, 0.5), inset 0 0 15px rgba(245, 158, 11, 0.2)",
      },
      animation: {
        "pulse-gold": "pulseGold 2s infinite ease-in-out",
        "fade-in": "fadeIn 0.2s ease-out forwards",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.01)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
