/** @type {import('tailwindcss').Config} */

import react from "@vitejs/plugin-react";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [react()],
};
