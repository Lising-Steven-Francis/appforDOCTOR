module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: [
    'react',
    'react-hooks',
    'import',
    'unused-imports',
  ],
  rules: {
    // Disable all perfectionist rules
    'perfectionist/sort-imports': 'off',
    'perfectionist/sort-named-imports': 'off',
    'perfectionist/sort-named-exports': 'off',
    'perfectionist/sort-exports': 'off',
    'import/order': 'off',
    // Disable all other perfectionist rules
    'perfectionist/*': 'off',
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        // Disable all perfectionist rules for TypeScript files
        'perfectionist/sort-imports': 'off',
        'perfectionist/sort-named-imports': 'off',
        'perfectionist/sort-named-exports': 'off',
        'perfectionist/sort-exports': 'off',
        'import/order': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Common rules
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

    // React rules
    'react/jsx-key': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    'react/jsx-boolean-value': 'error',
    'react/self-closing-comp': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

    // TypeScript rules
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],

    // Import rules
    'import/named': 'off',
    'import/export': 'off',
    'import/default': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default': 'off',
    'import/newline-after-import': 'error',
    'import/no-named-as-default-member': 'off',
    'import/no-cycle': ['off', { maxDepth: '∞', ignoreExternal: false, allowUnsafeDynamicCyclicDependency: false }],

    // Unused imports rules
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': ['off', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
  },
}; 