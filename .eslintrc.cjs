/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
  },
  plugins: ['import'],
  rules: {
    camelcase: 'warn',
    eqeqeq: 'warn',
    'max-params': 'warn',
    'max-depth': 'warn',
    'array-callback-return': 'warn',
    'no-return-await': 'warn',
    'require-atomic-updates': 'warn',
    'require-await': 'warn',
    'no-param-reassign': ['warn', { props: true }],
    curly: ['warn', 'multi-line'],
    'no-console': [
      'warn',
      { allow: ['time', 'timeEnd', 'info', 'error', 'debug'] },
    ],
    'padding-line-between-statements': [
      'warn',
      {
        blankLine: 'always',
        prev: '*',
        next: ['block-like', 'return', 'throw', 'export', 'break', 'continue'],
      },
      { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'never',
        alphabetize: { order: 'asc' },
      },
    ],
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'import/no-default-export': 'warn',
    '@typescript-eslint/padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'type' },
      { blankLine: 'always', prev: 'type', next: '*' },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      { selector: 'typeLike', format: ['PascalCase'] },
    ],
    '@typescript-eslint/sort-type-union-intersection-members': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-native-coercion-function': 'off',
    'unicorn/no-new-array': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-array-index-of': 'off',
    'unicorn/prefer-dom-node-text-content': 'off',
    'unicorn/catch-error-name': [
      'warn',
      {
        name: 'err',
      },
    ],
    'unicorn/filename-case': [
      'warn',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.config.{js,ts}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
