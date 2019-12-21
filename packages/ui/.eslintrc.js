module.exports = {
  root: false,
  extends: ['plugin:react/recommended', 'prettier/react'],
  parserOptions: {
    ecmaVersion: 2018,
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  env: {
    browser: true,
  },
  rules: {
    'jsx-quotes': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [['@', __dirname + '/src']],
        extensions: ['.js', '.ts', '.tsx', '.json'],
      },
    },
  },
}
