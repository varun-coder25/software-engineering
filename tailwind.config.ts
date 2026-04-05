import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102542",
        mist: "#eef4ff",
        sky: "#dce8ff",
        accent: "#2563eb",
        accentDark: "#1e40af"
      },
      boxShadow: {
        panel: "0 20px 50px -24px rgba(37, 99, 235, 0.28)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(96,165,250,0.24), transparent 34%), radial-gradient(circle at bottom right, rgba(99,102,241,0.18), transparent 28%)"
      }
    }
  },
  plugins: []
};

export default config;
