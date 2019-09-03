module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['@typescript-eslint', 'import', 'security'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-console': 2,
    'no-use-before-define': 0,
    'node/no-unsupported-features/es-syntax': 0,
    'node/prefer-promises/dns': 2,
    'node/prefer-promises/fs': 2,
    'import/no-default-export': 2,
    'import/no-useless-path-segments': [
      2,
      {
        noUselessIndex: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/prefer-includes': 2,
    '@typescript-eslint/prefer-string-starts-ends-with': 2,
    '@typescript-eslint/await-thenable': 2,
    '@typescript-eslint/explicit-member-accessibility': [
      2,
      { overrides: { constructors: 'no-public' } },
    ],
    '@typescript-eslint/consistent-type-definitions': [2, 'type'],
    '@typescript-eslint/consistent-type-assertions': [
      2,
      { assertionStyle: 'as' },
    ],
    'security/detect-object-injection': 0,
    'prettier/prettier': 0,
  },
  settings: {
    'import/resolver': {
      // Has to exist for some reason, can't find the issue on GitHub
      typescript: {},
    },
  },
}
