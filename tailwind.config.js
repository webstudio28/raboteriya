/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{njk,html,js}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--color-brand-primary)",
          secondary: "var(--color-brand-secondary)",
          accent: "var(--color-brand-accent)",
        },
        page: "#faf9f6",
        brown: {
          900: "#1A120B",
        },
      },
    },
  },
  plugins: [],
};
