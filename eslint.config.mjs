// ESLint Flat Config for Next.js + TypeScript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import next from '@next/eslint-plugin-next';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  next.configs["core-web-vitals"], // Next.js recommended rule-set

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
      "react-hooks": reactHooks,
      next
    },

    settings: {
      react: { version: "detect" }
    },

    rules: {
      // ❗ Disallow any usage strictly - override recommended config
      "@typescript-eslint/no-explicit-any": "error",

      // React Rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Next.js Best Practices
      "@next/next/no-html-link-for-pages": "off", // for App Router projects
      "@next/next/no-img-element": "warn",
    }
  }
);
