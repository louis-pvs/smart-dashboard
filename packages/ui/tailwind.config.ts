import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  presets: [sharedConfig],
  content: ["./src/**/*.tsx"],
};

export default config;
