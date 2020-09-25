'use strict';

// Common Configuration

import path from 'path';
import fs from 'fs';
import lessToJs from 'less-vars-to-js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const themeVariables = lessToJs(fs.readFileSync(path.join(
  __dirname,
  './css/ant-default-vars.less'
), 'utf8'));

const src = path.resolve(__dirname, 'src');
const dst = path.resolve(__dirname, 'dst');

export default {
  entry: {main: path.resolve(src, 'main.jsx')},

  output: {
    path: dst,
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',            
          },
        ],
      },
      {
        test: /\.less$/,

        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',   // translates CSS into CommonJS
          },
          {
            loader: 'less-loader',  // compiles Less to CSS
            options: {
              lessOptions: {
                modifyVars: themeVariables,
                root: path.resolve(__dirname, './'),
                javascriptEnabled: true,
              },
            },
          },
        ]
      },
      {
        test: /\.(jpg|gif|png|eot|wof|woff|ttf|svg)$/,
        loader: 'url-loader',
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    })
  ],
};
