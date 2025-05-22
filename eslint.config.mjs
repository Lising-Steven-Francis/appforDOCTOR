import globals from 'globals';
import eslintJs from '@eslint/js';
import eslintTs from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

// ----------------------------------------------------------------------

/**
 * @rules common
 * from 'react', 'eslint-plugin-react-hooks'...
 */
const commonRules = {
  'func-names': 'warn',
  'no-bitwise': 'error',
  'no-unused-vars': 'off',
  'object-shorthand': 'warn',
  'no-useless-rename': 'warn',
  'default-case-last': 'error',
  'consistent-return': 'error',
  'no-constant-condition': 'warn',
  'default-case': ['error', { commentPattern: '^no default$' }],
  'lines-around-directive': ['error', { before: 'always', after: 'always' }],
  'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],
  // react
  'react/jsx-key': 'error',
  'react/prop-types': 'off',
  'react/display-name': 'off',
  'react/no-children-prop': 'warn',
  'react/jsx-boolean-value': 'error',
  'react/self-closing-comp': 'error',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
  'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  // typescript
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/consistent-type-imports': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
};

/**
 * @rules import
 * from 'eslint-plugin-import'.
 */
const importRules = {
  'import/named': 'off',
  'import/export': 'off',
  'import/default': 'off',
  'import/namespace': 'off',
  'import/no-named-as-default': 'off',
  'import/newline-after-import': 'error',
  'import/no-named-as-default-member': 'off',
  'import/no-cycle': [
    'off',
    { maxDepth: '∞', ignoreExternal: false, allowUnsafeDynamicCyclicDependency: false },
  ],
};

/**
 * @rules unused imports
 * from 'eslint-plugin-unused-imports'.
 */
const unusedImportsRules = {
  'unused-imports/no-unused-imports': 'warn',
  'unused-imports/no-unused-vars': [
    'off',
    { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
  ],
};

/**
 * @rules sort or imports/exports
 * from 'eslint-plugin-perfectionist'.
 */
const sortImportsRules = {
  'perfectionist/sort-named-imports': ['warn', { type: 'line-length', order: 'asc' }],
  'perfectionist/sort-named-exports': ['warn', { type: 'line-length', order: 'asc' }],
  'perfectionist/sort-exports': [
    'warn',
    {
      order: 'asc',
      type: 'line-length',
      groupKind: 'values-first',
    },
  ],
  'perfectionist/sort-imports': [
    'error',
    {
      order: 'asc',
      ignoreCase: true,
      type: 'line-length',
      environment: 'node',
      maxLineLength: undefined,
      newlinesBetween: 'always',
      internalPattern: ['^src/.+'],
      groups: [
        'style',
        'side-effect',
        'type',
        ['builtin', 'external'],
        ['parent', 'sibling', 'index'],
        ['parent-type', 'sibling-type', 'index-type'],
        'object',
        'unknown',
      ],
    },
  ],
};

// ----------------------------------------------------------------------

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: ['*', '!src/', '!eslint.config.*'],
    languageOptions: {
      globals: { 
        ...globals.browser, 
        ...globals.node,
        React: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: { 
        version: 'detect',
        runtime: 'automatic',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImportsPlugin,
      perfectionist: perfectionistPlugin,
      import: importPlugin,
      react: reactPlugin,
    },
    rules: {
      ...commonRules,
      ...importRules,
      ...unusedImportsRules,
      ...sortImportsRules,
    },
  },
  {
    files: ['src/theme/extend-theme-types.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['src/**/*.tsx'],
    rules: {
      'react/jsx-key': 'error',
      'react/no-children-prop': 'warn',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  reactPlugin.configs.flat.recommended,
];
