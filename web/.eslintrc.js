module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_|^req|^next" },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
