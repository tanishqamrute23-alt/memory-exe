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
        win98: {
          bg: "#008080",
          gray: "#c0c0c0",
          light: "#ffffff",
          dark: "#808080",
          black: "#000000",
          blue: "#000080",
          title: "#000080",
          titleRight: "#1084d0",
        },
      },
      fontFamily: {
        pixel: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
