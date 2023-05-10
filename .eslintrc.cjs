// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  plugins: ["@typescript-eslint"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        vars: "all",
        args: "all",
        varsIgnorePattern: "^_",
      },
    ],
    "no-unused-vars": "off",
    "no-dupe-else-if": "error",
    "no-dupe-keys": "error",
    "no-duplicate-imports": "error",
    "no-unreachable": "error",
    "no-use-before-define": "error",
    "dot-notation": "error",
    eqeqeq: "error",
    "no-lonely-if": "error",
    "no-return-await": "error",
    "no-useless-catch": "error",
    "no-var": "error",
    "prefer-const": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "object-shorthand": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "no-implicit-coercion": "error",
    "@typescript-eslint/return-await": "error",
  },
};

module.exports = config;
