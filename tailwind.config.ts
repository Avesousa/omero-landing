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
        // ── Omero Brand (CEO approved) ───────────────────────
        primary: "#1E40AF",           // Azul Omero — alma de la marca
        "primary-light": "#3B82F6",   // azul medio
        "primary-deep": "#1e3a8a",    // azul oscuro

        // ── Nocturne Surfaces ────────────────────────────────
        surface: "#041329",
        "surface-dim": "#041329",
        "surface-bright": "#2c3951",
        "surface-container-lowest": "#010e24",
        "surface-container-low": "#0d1c32",
        "surface-container": "#112036",
        "surface-container-high": "#1c2a41",
        "surface-container-highest": "#27354c",
        "surface-variant": "#27354c",

        // ── On-Surface (text on dark bg) ─────────────────────
        "on-surface": "#d6e3ff",
        "on-surface-variant": "#e2bfb0",
        "inverse-surface": "#d6e3ff",
        "inverse-on-surface": "#233148",

        // ── Orange Accent (Nocturne CTA) ─────────────────────
        accent: "#FF6B00",            // Electric Orange — acción
        "accent-dim": "#E65A00",      // naranja profundo (gradiente)
        "accent-light": "#ffb693",    // naranja suave
        "accent-container": "#FF6B00",
        "on-accent": "#561f00",
        "inverse-accent": "#a04100",

        // ── Teal / Tertiary (Nocturne success) ───────────────
        teal: "#38DEBB",              // verde-turquesa — crecimiento
        "teal-container": "#00AD8F",
        "on-teal": "#00382d",

        // ── Secondary (blue-slate) ───────────────────────────
        secondary: "#b6c6ed",
        "secondary-container": "#374767",
        "on-secondary": "#20304f",
        "on-secondary-container": "#a5b5db",

        // ── Outline & Borders ────────────────────────────────
        outline: "#a98a7d",
        "outline-variant": "#5a4136",
        border: "#233554",

        // ── Error ────────────────────────────────────────────
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",

        // ── Legacy aliases (compatibility) ───────────────────
        dark: "#041329",
        medium: "#b6c6ed",
        light: "#0d1c32",
        success: "#38DEBB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
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
