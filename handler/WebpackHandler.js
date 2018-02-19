'use strict';

import webpack from 'webpack';


export default class WebpackHandler {

  init(config) {
    return new Promise((resolve, reject) => {
      this._compiler = webpack(config, (err) => {
        // On success
        if (err === null) {
          resolve();
        }

        // On failed
        reject(err);
      });
    });
  }

  run() {
    return new Promise((resolve, reject) => {
      this._compiler.run((err) => {
        // On success
        if (err === null) {
          resolve();
        }

        // On failed
        reject(err);
      });
    });
  }

}
