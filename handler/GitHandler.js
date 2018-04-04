'use strict';

import simpleGit from 'simple-git';
import path from 'path';


export default class GitHandler {

  constructor(repo) {
    this._git = simpleGit(repo);
  }

  // Get changed or created file list after the latest commit.
  diff() {
    return new Promise((resolve, reject) => {
      this._git.status((err, status) => {

        // On success
        if (err === null) {
          resolve(status.files.map((file) => {
            return file.path;
          }));
        }

        // On failed
        reject(err);
      });
    });
  }

  // Execute `git add ${filelist}`
  add(filelist) {
    return new Promise((resolve, reject) => {
      this._git.add(filelist, (err) => {

        // On success
        if (err === null) {
          resolve(filelist);
        }

        // On failed
        reject(err);
      });
    });
  }

  // Execute `git commit -m ${message}`
  commit(message) {
    return new Promise((resolve, reject) => {
      this._git.commit(message, (err) => {

        // On success
        if (err === null) {
          resolve(message);
        }

        // On failed
        reject(err);
      });
    });
  }

  // Execute `git push ${remote} ${branch}`
  push(remote, branch) {
    return new Promise((resolve, reject) => {
      this._git.push(remote, branch, (err, result) => {

        // On success
        if (err === null) {
          resolve(result);
        }

        // On failed
        reject(err);
      });
    });
  }

  clone(repo_path) {
    return new Promise((resolve, reject) => {
      this._git.clone(repo_path, (err, result) => {

        // On success
        if (err === null) {
          resolve(path.parse(repo_path).name);
        }

        // On failed
        reject(err);
      });
    });
  }

}
