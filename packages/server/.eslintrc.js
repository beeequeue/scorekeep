module.exports = {
  root: false,
  env: {
    node: true,
  },
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  }
}
