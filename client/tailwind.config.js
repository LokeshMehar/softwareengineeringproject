module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}","./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
//   ./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"