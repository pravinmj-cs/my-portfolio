import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#030712",
        trench: "#061321",
        pelagic: "#0B3954",
        reef: "#00D1FF",
        aurora: "#8B5CF6",
        coral: "#FF6B6B",
        kelp: "#29D398",
        sunlit: "#F8E16C",
        starlight: "#DCEBFF"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "Space Grotesk", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(0, 209, 255, 0.22)",
        portal: "0 0 90px rgba(139, 92, 246, 0.42)"
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at center, rgba(0,209,255,.24), transparent 42%)"
      }
    }
  },
  plugins: []
};

export default config;
