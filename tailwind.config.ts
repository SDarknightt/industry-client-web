import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: '#314c53',
        secondary: '#5a7f78',
        third: '#bbdec6',
        ice: '#f7f8fc'
      },
    },
  },
  plugins: [],
} satisfies Config;
