import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],

    // Language setup
    languageOptions: {
      globals: globals.browser,
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
    },

    // Plugins and extensions
    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      ...js.configs.recommended.rules, // Include ESLint recommended rules
      'prettier/prettier': 'error', // Show Prettier issues as ESLint errors
      'no-unused-vars': 'warn', // Optional: customize your rules
    },
  },

  // 🔹 Ignore unnecessary folders
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', '.husky/_'],
  },

  // 🔹 Apply Prettier config last to disable conflicting ESLint stylistic rules
  prettier,
]);
