module.exports = {
  root: false,
  extends: ['plugin:node/recommended'],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  rules: {
    'node/no-missing-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-unpublished-import': 'off',
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', __dirname + '/src']],
        extensions: ['.js', '.ts', '.json'],
      },
    },
  },
}
