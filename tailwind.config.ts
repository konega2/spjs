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
        navy: "#0B1C2D",
        blush: "#F48FB1",
        mist: "#f2f5f8",
      },
      backgroundImage: {
        watercolor:
          "radial-gradient(circle at 20% 10%, rgba(244,143,177,0.28), transparent 45%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 50% 80%, rgba(244,143,177,0.18), transparent 35%)",
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;