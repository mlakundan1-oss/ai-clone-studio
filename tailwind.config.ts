import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        surface: "#111827",
        "surface-2": "#1a2035",
        "surface-3": "#1e2740",
        primary: "#2563eb",
        "primary-hover": "#1d4ed8",
        accent: "#7c3aed",
        cyan: "#06b6d4",
        "neon-blue": "#3b82f6",
        "neon-purple": "#8b5cf6",
        "neon-cyan": "#22d3ee",
        border: "rgba(255,255,255,0.08)",
        "border-bright": "rgba(255,255,255,0.15)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh": "linear-gradient(135deg, #0b0f19 0%, #111827 50%, #0f172a 100%)",
        "hero-gradient": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,0.3), transparent)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "neon-gradient": "linear-gradient(135deg, #2563eb, #7c3aed)",
        "cyan-gradient": "linear-gradient(135deg, #06b6d4, #2563eb)",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(37,99,235,0.5), 0 0 40px rgba(37,99,235,0.2)",
        "neon-purple": "0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.2)",
        "neon-cyan": "0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(6,182,212,0.2)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        "card": "0 4px 24px rgba(0,0,0,0.3)",
        "glow-sm": "0 0 10px rgba(37,99,235,0.4)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "shimmer": "shimmer 2s linear infinite",
        "scan": "scan 3s linear infinite",
        "orbit": "orbit 10s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(37,99,235,0.5)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 40px rgba(37,99,235,0.8)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(100px) rotate(-360deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
