/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  arrowParens: "always",
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  endOfLine: "lf",
  jsxSingleQuote: false,
  singleQuote: false,
  trailingComma: "es5",
};

module.exports = config;
