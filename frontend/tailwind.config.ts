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
      // Bumped ~10-15% over Tailwind's stock scale, site-wide — the old
      // scale (text-sm=14px as the de-facto body size) read cramped next
      // to reference sites like ngmk.uz, which sets body copy closer to
      // 17-18px with generous line-height. Every text-* utility already
      // used across the codebase inherits this automatically; only the
      // handful of components using arbitrary text-[Npx] values (bypassing
      // this scale entirely) needed separate, per-file adjustment.
      fontSize: {
        xs:   ["13px", { lineHeight: "17px" }],
        sm:   ["15px", { lineHeight: "22px" }],
        base: ["17px", { lineHeight: "26px" }],
        lg:   ["19px", { lineHeight: "30px" }],
        xl:   ["21px", { lineHeight: "30px" }],
        "2xl": ["26px", { lineHeight: "34px" }],
        "3xl": ["32px", { lineHeight: "38px" }],
        "4xl": ["39px", { lineHeight: "44px" }],
        "5xl": ["51px", { lineHeight: "1" }],
        "6xl": ["63px", { lineHeight: "1" }],
      },
      colors: {
        // Theme-aware semantic tokens — backed by CSS variables
        surface: {
          DEFAULT: "var(--surface)",
          secondary: "var(--surface-secondary)",
          card: "var(--surface-card)",
        },
        content: {
          DEFAULT: "var(--content)",
          secondary: "var(--content-secondary)",
          muted: "var(--content-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          secondary: "var(--accent-secondary)",
          glow: "var(--accent-glow)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
      },
      backgroundImage: {
        "theme-gradient": "var(--gradient)",
        "accent-gradient": "var(--accent-gradient)",
      },
      boxShadow: {
        glow: "0 0 20px var(--accent-glow)",
        "glow-lg": "0 0 40px var(--accent-glow), 0 0 80px var(--accent-glow-far)",
        "card": "0 4px 24px rgba(0,0,0,0.15)",
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
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
