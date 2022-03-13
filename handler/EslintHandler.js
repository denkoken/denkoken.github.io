'use strict';

import {ESLint} from 'eslint';


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
    this._eslint = new ESLint(props);
  }

  check(files) {
    const lintlist = files.filter((src) => {
      return (/\.js[x]?$/).test(src);
    });

    // Apply eslint
    return this._eslint.lintFiles(lintlist)
      .then(lintResults => {
        lintResults = lintResults.filter(lintResult => lintResult.errorCount > 0);

        // No error is found
        if (lintResults.length === 0) return files;

        // No error is found
        return lintResults.map(e => {
          return {path: e.filePath, message: perseMessage(e.messages)};
        });
      });
  }
}
