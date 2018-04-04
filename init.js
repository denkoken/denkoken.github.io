'use strict';

import fs from 'fs';
import path from 'path';

import GitHandler from './handler/GitHandler.js';


const git = new GitHandler('./');
const repo = 'https://gitlab.com/denko/denkoken_twitter_authentication.git';
const target = 'twitter.json';
const dstDir = 'config';


git.clone(repo).
  then((dir) => {
    const srcPath = path.resolve(dir, target);
    const dstPath = path.resolve(dstDir, target);
    const srcObj = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
    const dstObj = JSON.parse(fs.readFileSync(dstPath, 'utf8'));

    const result = JSON.stringify(Object.assign({}, srcObj, dstObj));

    fs.writeFileSync(path.resolve(dstDir, target), result);

    console.log('twitter authentication successed');
  }).
  catch((err) => {
    console.log(err);
  });
