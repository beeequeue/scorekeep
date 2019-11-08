/* eslint-disable @typescript-eslint/no-var-requires,node/no-unpublished-require */
const webpack = require('webpack')
const { resolve } = require('path')
const DotenvPlugin = require('dotenv-webpack')
const HtmlPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanupPlugin = require('webpack-cleanup-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const noUndefined = arr => arr.filter(item => item != null)
const isProduction = (a, b = undefined) =>
  process.env.NODE_ENV === 'production' ? a : b
const isDev = (a, b = undefined) => isProduction(b, a)

const reactAppEnvVars = Object.keys(process.env)
  .filter(s => s.startsWith('REACT_APP_'))
  .reduce((obj, key) => {
    obj[key] = JSON.stringify(process.env[key])

    return obj
  }, {})

/**
 * @type { webpack.Configuration }
 */
module.exports = {
  mode: isDev('development', 'production'),
  entry: resolve('src/index.tsx'),
  output: {
    path: resolve('dist'),
    filename: isProduction('bundle.[hash:8].js', 'bundle.js'),
    chunkFilename: isProduction('[name].[hash:8].js', '[name].js'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        use: 'react-hot-loader/webpack',
        include: /node_modules/,
      },
      {
        test: /\.(png|jpe?g)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader',
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: noUndefined([
    new DotenvPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ...reactAppEnvVars,
      },
    }),
    isProduction(new CleanupPlugin()),
    new webpack.HashedModuleIdsPlugin({
      hashDigest: 'hex',
      hashDigestLength: 8,
    }),
    new HtmlPlugin({
      inject: true,
      template: resolve('public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    isProduction(
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
    ),
    isProduction(
      new CopyPlugin([
        {
          from: 'public',
          to: './',
        },
      ]),
    ),
    new ForkTsCheckerWebpackPlugin(),
  ]),
  performance: {
    hints: false,
  },
  devServer: {
    stats: 'minimal',
    // allowedHosts: [''],
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 3100,
  },
}
