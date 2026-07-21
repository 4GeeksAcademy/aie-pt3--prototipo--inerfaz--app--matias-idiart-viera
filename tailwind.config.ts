import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-fixed": "#ede9fe",
        "on-secondary": "#09090b",
        "tertiary-container": "#065f46",
        "surface-container-lowest": "#09090b",
        "inverse-surface": "#fafafa",
        "on-secondary-container": "#a1a1aa",
        "on-error-container": "#fca5a5",
        "secondary-fixed": "#a1a1aa",
        "background": "#09090b",
        "on-tertiary-fixed": "#003318",
        "inverse-on-surface": "#09090b",
        "error-container": "#3b1111",
        "on-surface-variant": "#a1a1aa",
        "secondary-container": "#27272a",
        "surface-container-highest": "#1e1e22",
        "on-tertiary-container": "#bbf7d0",
        "on-background": "#fafafa",
        "surface-container": "#121215",
        "on-primary-fixed": "#2e1065",
        "on-surface": "#fafafa",
        "on-error": "#1a0000",
        "primary-fixed-dim": "#c4b5fd",
        "on-tertiary": "#001a12",
        "surface-container-high": "#18181b",
        "tertiary": "#34d399",
        "primary-container": "#7c3aed",
        "outline": "#52525b",
        "on-secondary-fixed-variant": "#3f3f46",
        "surface-dim": "#0c0c0f",
        "surface-bright": "#18181b",
        "surface": "#0c0c0f",
        "on-secondary-fixed": "#18181b",
        "tertiary-fixed-dim": "#6ee7b7",
        "on-tertiary-fixed-variant": "#047857",
        "on-primary-container": "#ede9fe",
        "inverse-primary": "#5b21b6",
        "secondary-fixed-dim": "#71717a",
        "tertiary-fixed": "#bbf7d0",
        "surface-tint": "#a78bfa",
        "on-primary-fixed-variant": "#5b21b6",
        "surface-variant": "#18181b",
        "secondary": "#71717a",
        "primary": "#a78bfa",
        "on-primary": "#0a0012",
        "error": "#ef4444",
        "outline-variant": "#27272a",
        "surface-container-low": "#0f0f12"
      },
      fontFamily: {
        headline: ["Geist", "sans-serif"],
        display: ["Geist", "sans-serif"],
        body: ["Geist", "sans-serif"],
        label: ["Geist", "sans-serif"]
      }
    },
  },
  plugins: [],
};

export default config;
