import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  // Global ignores
  {
    ignores: ["node_modules/**", "build/**", ".react-router/**", "dist/**", "coverage/**"],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React rules (using flat config API for ESLint 10 compatibility)
  {
    files: ["**/*.{tsx,jsx}"],
    ...reactPlugin.configs.flat.recommended,
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform
      "react/prop-types": "off", // TypeScript handles this
      "react/display-name": "warn",

      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // Accessibility
      ...jsxA11y.configs.recommended.rules,
    },
  },

  // TypeScript-specific rules for all TS/TSX files
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },

  // Test file overrides
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}", "test/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
