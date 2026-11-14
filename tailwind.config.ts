
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        learnwise: {
          background: "#171421",
          sidebar: "#211e2c",
          surface: "#292536",
          purple: "#8060f5",
          accent: "#d7ff63",
        },
      },
    },
  },
  plugins: [],
};

export default config;
