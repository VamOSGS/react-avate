const merge = require('webpack-merge');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const production = require('./webpack.config.prod');
const development = require('./webpack.config.dev');
const PATHS = require('./PATHS');
require('dotenv').config();

const { ANALYZE, ENV } = process.env;
const pathsToClean = ['dist'];

const cleanOptions = {
  root: path.resolve(),
  verbose: true,
  dry: false,
};

const common = {
  entry: PATHS.APP,
  output: {
    path: PATHS.DIST,
    filename: 'app.bundle.[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve: {
    modules: ['node_modules', PATHS.SRC],
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
  ],
  optimization: {
    namedModules: true,
    splitChunks: {
      cacheGroups: {
        default: false,
        react: {
          test: /react/,
          name: 'react',
          minSize: 1,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
        vendor: {
          test: /node_modules\/(?!react)/,
          name: 'vendor',
          minChunks: 2,
          minSize: 1,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};

module.exports = () => {
  const config = merge(common, ENV === 'DEV' ? development : production);
  return config;
};
