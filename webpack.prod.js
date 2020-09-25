'use strict';

// Configuration for Release

const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(
    common,
    {
      mode: 'production',
      optimization: {
        minimizer: [
          new OptimizeCSSAssetsPlugin({}),
          new TerserPlugin({
            terserOptions: {
              keep_classnames: true,
              drop_console: true
            }
          })
        ]
      }
    }
  );