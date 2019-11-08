module.exports = {
  presets: [
    ['@babel/env', { modules: false, useBuiltIns: 'usage', corejs: 3 }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-numeric-separator',
    'babel-plugin-styled-components',
  ],
}
