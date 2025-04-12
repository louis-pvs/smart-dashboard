import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-urbanist)", "system-ui", "Helvetica", "sans-serif"],
        heading: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
};
export default config;
