import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Tokens ligados a variables CSS (app/globals.css) —
        // reaccionan al atributo data-theme, igual que en /omero ──
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-deep": "var(--color-primary-deep)",

        accent: "var(--color-accent)",
        "accent-dim": "var(--color-accent-dim)",
        "accent-light": "var(--color-accent-light)",

        teal: "var(--color-teal)",
        success: "var(--color-success)",
        error: "var(--color-error)",

        bg: "var(--color-bg)",
        "surface-low": "var(--color-surface-low)",
        surface: "var(--color-surface)",
        "surface-high": "var(--color-surface-high)",
        "surface-highest": "var(--color-surface-highest)",

        // Alias — nombres usados en los componentes (mismo valor)
        "surface-container-lowest": "var(--color-bg)",
        "surface-container-low": "var(--color-surface-low)",
        "surface-container": "var(--color-surface)",
        "surface-container-high": "var(--color-surface-high)",
        "surface-container-highest": "var(--color-surface-highest)",

        "on-surface": "var(--color-text)",
        "on-surface-variant": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",

        border: "var(--color-border)",
        "border-2": "var(--color-border-2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "gradient-x": "gradientX 6s ease infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "count-blink": "countBlink 1s steps(1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 107, 0, 0)" },
          "50%": { boxShadow: "0 0 24px 6px rgba(255, 107, 0, 0.3)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        countBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      backgroundSize: {
        "200%": "200% 200%",
        "300%": "300% 300%",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
