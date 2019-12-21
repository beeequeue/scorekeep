module.exports = {
  root: false,
  extends: ['plugin:react/recommended', 'prettier/react'],
  plugins: ['graphql'],
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
    'graphql/template-strings': ['error', { env: 'apollo' }],
    'graphql/named-operations': ['error', { env: 'apollo' }],
    'graphql/required-fields': [
      'error',
      { env: 'apollo', requiredFields: ['uuid'] },
    ],
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
