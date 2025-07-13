import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;