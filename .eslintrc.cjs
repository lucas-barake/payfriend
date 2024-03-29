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
        tsconfigRootDir: __dirname,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  plugins: ["@typescript-eslint", "tailwindcss"],
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
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    "consistent-return": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    "object-shorthand": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "no-implicit-coercion": "error",
    "@typescript-eslint/return-await": "error",
    "no-unneeded-ternary": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: ["../"],
      },
    ],
    "@typescript-eslint/no-confusing-void-expression": "error",
    "@typescript-eslint/no-meaningless-void-operator": "warn",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: ["arrow-function"],
        unnamedComponents: "arrow-function",
      },
    ],
    "no-plusplus": [
      "error",
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        labelComponents: ["Label"],
        labelAttributes: ["label"],
        controlComponents: ["Input", "Select"],
        depth: 2,
        required: {
          some: ["nesting", "id"],
        },
      },
    ],
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
  },
};

module.exports = config;
