const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
      },
    ],
  })
  config.resolve.extensions.push('.ts', '.tsx')

  config.resolve.plugins = [new TsconfigPathsPlugin()]
  return config
}
