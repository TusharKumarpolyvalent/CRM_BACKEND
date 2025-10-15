const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
    },
  },
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', '.husky/_'],
  },
  prettier,
];
