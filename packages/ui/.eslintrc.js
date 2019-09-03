module.exports = {
  root: false,
  extends: ['../../.eslintrc.js', 'plugin:react/recommended', 'prettier/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': 'webpack',
  },
  rules: {
    'jsx-quotes': 0,
  },
}
