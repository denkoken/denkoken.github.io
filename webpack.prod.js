'use strict';

// Configuration for Release

import {merge} from 'webpack-merge';
import common from './webpack.common';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

export default merge(
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