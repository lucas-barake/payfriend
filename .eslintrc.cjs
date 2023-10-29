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
  plugins: ["@typescript-eslint", "tailwindcss", "eslint-plugin-react"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["acc", "next"],
      },
    ],
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
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
    ],
    "@typescript-eslint/prefer-optional-chain": "error",
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
    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
    "@typescript-eslint/no-empty-interface": "error",
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
    "@typescript-eslint/return-await": "error",
    "no-unneeded-ternary": "error",
    "@typescript-eslint/no-confusing-void-expression": "error",
    "@typescript-eslint/no-meaningless-void-operator": "warn",
    "no-plusplus": [
      "error",
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "explicit",
        overrides: {
          accessors: "off",
          constructors: "no-public",
          methods: "explicit",
          properties: "explicit",
          parameterProperties: "explicit",
        },
      },
    ],
    "@typescript-eslint/consistent-type-exports": [
      "error",
      {
        fixMixedExportsWithInlineTypeSpecifier: true,
      },
    ],
    "@typescript-eslint/consistent-generic-constructors": "error",
    "@typescript-eslint/no-confusing-non-null-assertion": "error",
    "@typescript-eslint/no-duplicate-enum-values": "error",
    "no-self-compare": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: ["../"],
      },
    ],
    "import/no-default-export": "warn",
    "no-implicit-coercion": "error",
    "prefer-template": "error",

    // React
    "react/button-has-type": "error",
    "react/display-name": "error",
    "react/hook-use-state": "error",
    "react/jsx-fragments": ["error", "element"],
    "react/jsx-key": "error",
    "react/jsx-no-target-blank": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/jsx-pascal-case": "error",
    "react/no-array-index-key": "warn",
    "react/self-closing-comp": "error",

    // Tailwind
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/enforces-shorthand": "error",
    "tailwindcss/no-contradicting-classname": "error",
  },
};

module.exports = config;
