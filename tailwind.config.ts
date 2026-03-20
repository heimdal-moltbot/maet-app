import type { Config } from "tailwindcss";

// Design system tokens — UX v1.0 · 2026-03-20
// Kilde: /ux/design-specs/00-design-system.md

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primær palette (UX v1.0)
        primary: {
          DEFAULT: "#E8734A",    // Terracotta — CEO-godkendt 20/3 (kanonisk)
          dark: "#C4572A",       // hover/pressed
          light: "rgba(232,115,74,0.10)", // chip-baggrunde
        },
        accent: {
          DEFAULT: "#606C38",    // sekundære knapper, bekræftelse
          dark: "#4A5229",       // hover accent
          light: "#EBF0DB",      // success badges, planlagte
        },
        // Baggrunde
        bg: {
          DEFAULT: "#FEFAE0",    // app-baggrund
          surface: "#FFFFFF",    // kort, sheets
          alt: "#F5F4E8",        // chip-baggrunde, subtile sektioner
        },
        // Tekst
        txt: {
          primary: "#1A1A1A",
          secondary: "#6B6B5A",
          muted: "#B0AF9E",
        },
        // Borders
        border: {
          DEFAULT: "#E8E8D8",
          muted: "#D5D4C4",
        },
        // Status
        error: "#D64545",
        warning: "#D4A853",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "h1": ["24px", { lineHeight: "30px", fontWeight: "700" }],
        "h2": ["20px", { lineHeight: "26px", fontWeight: "700" }],
        "h3": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "label-lg": ["16px", { lineHeight: "22px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body": ["15px", { lineHeight: "22px", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "20px", fontWeight: "500" }],
        "label": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "caption": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "micro": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "overline": ["12px", { lineHeight: "16px", fontWeight: "700" }],
      },
      spacing: {
        "2": "2px",
        "4": "4px",
        "8": "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "32": "32px",
        "48": "48px",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        full: "50%",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0,0,0,0.06)",
        md: "0 4px 16px rgba(0,0,0,0.10)",
        lg: "0 8px 32px rgba(0,0,0,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
