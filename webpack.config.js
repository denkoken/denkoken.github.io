const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');

const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname,
  './css/ant-default-vars.less'), 'utf8'));
const src = path.resolve(__dirname, 'src');
const dst = path.resolve(__dirname, 'dst');

module.exports = {

  entry: {
    main: path.resolve(src, 'main.jsx'),
  },

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
            options: {
              presets: [
                'env',
                'react',
              ],
              plugins: [
                ['import', {libraryName: 'antd', style: true}],
              ],
            },
          }
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: themeVariables,
              root: path.resolve(__dirname, './'),
            },
          }
        ],
      },
      {
        test: /\.(jpg|gif|png|eot|wof|woff|ttf|svg)$/,
        loader: 'url-loader',
      }
    ],
  },
};
