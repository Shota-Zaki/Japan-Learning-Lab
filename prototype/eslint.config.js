import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist/**", "node_modules/**", "public/data/**", "src/data/generated/**"] },
  {
    files: ["src/**/*.{js,jsx}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["worker/**/*.js", "scripts/**/*.mjs", "tests/**/*.mjs", "vite.config.mjs"],
    ...js.configs.recommended,
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.node, ...globals.browser } },
    rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }] },
  },
];
