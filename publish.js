'use strict';

import fs from 'fs';
import path from 'path';
import 'date-utils';

import EslintHandler from './handler/EslintHandler.js';
import GitHandler from './handler/GitHandler.js';
import WebpackHandler from './handler/WebpackHandler.js';
// import TwitterHandler from './handler/TwitterHandler.js';

import internal_paths from './config/internal_paths.json';
import {homepage_root_url} from './config/general.json';
import config from './config/publish.json';

import webpackConfig from './webpack.prod.js';
import rules from './.eslintrc.json';


const eslint = new EslintHandler({
  overrideConfigFile: "./.eslintrc.json",
  fix: true,
});
const git = new GitHandler('./');
const webpack = new WebpackHandler();

const notFound = -1;

// const tweetList = [];


const shouldAppendList = function(src) {
  const dir = path.dirname(src);
  const lists = config.list.filter((pair) => {
    return pair.src_dir === dir;
  });

  return lists.length > 0;
};

const shouldUpdate = function(src) {
  if (config.update.except.indexOf(src) !== notFound) {
    return false;
  }

  return (
    config.update.dir.indexOf(path.dirname(src)) !== notFound ||
    config.update.file.indexOf(src) !== notFound
  );
};

const shouldRebuild = (src) => {
  if (config.rebuild.except.indexOf(src) !== notFound) {
    return false;
  }

  return (
    config.rebuild.dir.indexOf(path.dirname(src)) !== notFound ||
    config.rebuild.file.indexOf(src) !== notFound
  );
};

const getFilelist = function(paths) {
  const files = [];

  // Replace directory path in "paths" with its child paths.
  paths.forEach((src) => {
    if (fs.statSync(src).isDirectory()) {
      fs.readdirSync(src).forEach((child) => {
        files.push(path.join(src, child));
      });

    } else {
      files.push(src);
    }
  });

  return files;
};

const createJoblist = function(files) {
  const addlist = {};

  // Append paths which requires rebuild.
  addlist.rebuild = files.filter((src) => {
    return shouldRebuild(src);
  });

  // Append paths which requires update.
  addlist.update = files.filter((src) => {
    return shouldUpdate(src);
  });

  // Append paths which requires append log.
  addlist.list = config.list.map((pair) => {
    return {
      src: files.filter((src) => {
        return pair.src_dir === path.dirname(src);
      }),
      dst: pair.dst_path,
    };
  });

  return addlist;
};

const appendToList = function(src, dst) {
  const srcJson = JSON.parse(fs.readFileSync(src, 'utf8'));
  let dstJson = fs.existsSync(dst) ?
    JSON.parse(fs.readFileSync(dst, 'utf8')) :
    [];

  // remove src from dst list if already listed in dst
  dstJson = dstJson.filter((obj) => {
    return obj.path !== src;
  });

  // Get article infomation.
  const title = srcJson[Object.keys(srcJson)[0]].title;
  const date = new Date();
  const dateArr = date.
    toFormat('YYYY,MM,DD').
    split(',').
    map((s) => {
      return Number(s);
    });

  // Append article infomation to the list.
  dstJson.push({
    title: title,
    path: src,
    date: dateArr,
  });
  fs.writeFileSync(dst, JSON.stringify(dstJson, '', '    '));
};

const eslintErrorConsole = function(errors) {
  console.log(errors);
  // console.log(errors.map((pair) => {
  //   return [
  //     `\n${pair.message.length} problem is found in "${pair.path}"`,
  //     pair.message.join('\n'),
  //   ].join('\n');
  // }).join('\n\n'));
  throw Error('eslint is failed');
};

const jsonpathToUrl = function(jsonpath) {
  let listIndex = null;
  let topic_path = null;
  let topic = null;

  // check json path is located in list branch
  config.list.forEach(({src_dir, dst_path}) => {
    if (path.dirname(jsonpath) === src_dir) {

      // get list index
      JSON.parse(fs.readFileSync(dst_path, 'utf8')).forEach(({path}, idx) => {
        if (path === jsonpath) {
          listIndex = idx;
        }
      });

      // set list path
      topic_path = dst_path;
    }
  });

  topic_path = topic_path === null ?
    jsonpath :
    topic_path;

  // search topic
  Object.keys(internal_paths).map((key) => {
    if (internal_paths[key] === topic_path) {
      topic = key;
    }
  });

  if (topic === null) {
    return null;
  }

  const query = `?topic=${topic}${
    listIndex === null ?
      '' :
      `&list=${listIndex}`
  }`;

  return homepage_root_url + query;
};

git.diff().
  then((diff) => {
    console.log(`${diff.length} unstaged files are found\n`);

    return eslint.check(getFilelist(diff).filter((src) => {
      return (
        shouldUpdate(src) ||
        shouldRebuild(src) ||
        shouldAppendList(src)
      );
    }));

  }).
  then((files) => {
    console.log('Eslint successed\n');
    const joblist = createJoblist(files);
    const addlist = files;

    // Write article infomation list
    if (joblist.list.length > 0) {
      joblist.list.forEach((pair) => {
        pair.src.forEach((src) => {
          appendToList(src, pair.dst);
          console.log(` + "${src}" -> "${pair.dst}"`);
        });

        if (pair.src.length > 0) {
          addlist.push(pair.dst);
        }
      });
    }

    // Execute webpack for production
    if (joblist.rebuild.length > 0) {
      console.log('preparing to build...');
      return webpack.init(webpackConfig).
        then(() => {
          console.log('webpack is running...');

          return webpack.run();
        }).
        then(() => {
          console.log('bundle successed');

          return git.add(addlist.concat(config.bundle));
        }).
        catch((err) => {
          throw err;
        });
    }

    return git.add(addlist);
  }, eslintErrorConsole).
  then((files) => {
    files.forEach((file) => {
      // add tweet list when json file is update
      // if (path.parse(file).ext === '.json') {
      //   const url = jsonpathToUrl(file);
      //   if (url !== null) {
      //     tweetList.push(TwitterHandler(url));
      //   }
      // }

      console.log(` >> git add "${file}"`);
    });

    return git.commit('Auto-generated commit');
  }).
  then((message) => {
    console.log('\n');
    console.log(` >> git commit -m "${message}"`);

    return git.push('origin', 'develop');
  }, (err) => {
    console.log(err);
  }).
  // then(() => {
  //   return Promise.all(tweetList);
  // }).
  // then((tweets) => {
  //   tweets.forEach(({text}) => {
  //     console.log(` >> new tweet : "${text}"`);
  //   });
  // }).
  catch((err) => {
    console.error(err);
  });
