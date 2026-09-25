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
        // FCIAZ official brand palette (sampled from the approved emblem).
        // Three pillars mirror the wordmark:
        //   brand   = Navy/purple  → Advocacy
        //   rose    = Magenta/pink → Treatment
        //   accent  = Teal         → Reintegration
        //   lavender= Soft purple  → highlight / baby silhouette
        brand: {
          50: "#f1eef9",
          100: "#dfd9f0",
          200: "#bcb2e0",
          300: "#978bce",
          400: "#7265bc",
          500: "#4e3faa",
          600: "#3c2a99",
          700: "#311f85",
          800: "#240A6D", // primary FCIAZ navy/purple
          900: "#1c0854",
          950: "#0f0432",
        },
        rose: {
          50: "#fde7f1",
          100: "#fcd0e3",
          200: "#f8a4ca",
          300: "#f078af",
          400: "#e54a92",
          500: "#C40591", // primary FCIAZ magenta
          600: "#a50476",
          700: "#860361",
          800: "#68024b",
          900: "#4a0235",
          950: "#29011d",
        },
        accent: {
          50: "#e6f5f5",
          100: "#bfe6e5",
          200: "#82c8c5",
          300: "#4da9a6",
          400: "#1A6B7B", // primary FCIAZ teal (closer to image)
          500: "#105a6a",
          600: "#0d4a57",
          700: "#0c3a44",
          800: "#0a2d35",
          900: "#082027",
          950: "#041114",
        },
        lavender: {
          50: "#f5f0fc",
          100: "#e8dcf8",
          200: "#d0b9f0",
          300: "#b796e8",
          400: "#9073e0",
          500: "#6736CD", // primary FCIAZ lavender
          600: "#5a2cb0",
          700: "#4a2493",
          800: "#391d77",
          900: "#29155b",
          950: "#1a0d3d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
