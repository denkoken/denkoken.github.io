'use strict';

import {CLIEngine} from 'eslint';


const paddingLine = 3;
const paddingColumn = 3;
const paddingId = 20;
const paddingMessage = 60;


const paddingStringLeft = (str, length, pad) => {
  return String(str).
    concat(pad.repeat(length)).
    slice(0, length);
};

const paddingStringRight = (str, length, pad) => {
  return pad.
    repeat(length).
    concat(String(str)).
    slice(-length);
};

const perseMessage = (message) => {
  return message.map((msg) => {
    const line = paddingStringRight(msg.line, paddingLine, ' ');
    const column = paddingStringRight(msg.column, paddingColumn, ' ');
    const ruleId = paddingStringLeft(msg.ruleId, paddingId, ' ');
    const message = paddingStringLeft(msg.message, paddingMessage, ' ');

    return `${line}:${column} ${message}${ruleId}`;
  });
};


export default class EslintHandler {

  constructor(props) {
    this._eslint = new CLIEngine(props);
  }

  check(files) {
    const lintlist = files.filter((src) => {
      return (/\.js[x]?$/).test(src);
    });

    return new Promise((resolve, reject) => {

      // Apply eslint
      const errors = this._eslint.executeOnFiles(lintlist);

      // No error is found
      if (errors.errorCount === 0) {
        resolve(files);
      }

      // On errors are found
      reject(errors.result.map((result) => {
        if (result.errorCount > 0) {
          return {
            path: result.filePath,
            message: perseMessage(result.message),
          };
        }
      }));
    });
  }

}
