'use strict';

import webpack from 'webpack';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

import common from './webpack.config.babel.js';

const prod = {'process.env.NODE_ENV': JSON.stringify('production')};

export default merge(
  common,
  {
    devtool: 'source-map',
    plugins: [
      new UglifyJSPlugin({
        sourceMap: true,
      }),
      new webpack.DefinePlugin(prod),
    ],
  }
);
