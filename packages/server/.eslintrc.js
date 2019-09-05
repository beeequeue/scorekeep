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
    'node/no-unsupported-features/es-syntax': 0,
    'node/prefer-promises/dns': 2,
    'node/prefer-promises/fs': 2,
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
