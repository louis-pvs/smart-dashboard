import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Arial",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        heading: ["var(--font-montserrat)", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
};
export default config;
