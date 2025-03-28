import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist/**/*', 'webpack.config.js', './temp/**/*'],
    languageOptions: {
      globals: {
        ...globals.browser,
        H5P: 'readonly',
        H5PEditor: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/prop-types': 'warn',
    },
  },
]);
