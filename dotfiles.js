// setup user dotfiles

var Promise = require("bluebird");
var join = Promise.join;
var fs = Promise.promisifyAll(require('fs'));
var path = require('path-extra');

module.exports = function (app) {

  var timestamp = new Date().getTime();
  var File = function (src, tgt) {
    this.source = src;
    this.target = tgt;
  };

  File.prototype = {
    // remove existing symlink
    unlink: function (loc) {
      app.msg('Removed link:', loc);
      return fs.unlinkAsync(loc);
    },

    // create a symlink from dotfile location to target code
    symlink: function (src, tgt) {
      return fs.symlinkAsync(src, tgt)
        .then(function () {
          app.msg('Added symlink:', src, '->', tgt);
        })
        .catch(function (e) {
          app.warn('Could not create symlink:', tgt, e);
        });
    },

    // backup the file, adding timestamp
    backup: function (target) {
      var oldPath = target.loc;
      var newPath = oldPath + '.bkup.' + timestamp;

      return fs.renameAsync(oldPath, newPath)
        .then(function () {
          app.msg('Created backup:', newPath);
        })
        .catch(function (e) {
          app.warn('Could not create backup:', newPath, e);
        });
    },

    sourceFiles: function (dir) {
      // setup buffer to hold lines
      var lines = ['#!/bin/bash',''];

      return fs.readdirAsync(dir.source.loc)
        .each(function (name) {
          var line = 'source ' + srcDir + '/' + name;

          // comment line, based on user input

          lines.push(line);
        })
        .then(function () {
          // write the file
          app.msg('Created file:', dir.target.loc);
          return fs.writeFileAsync(dir.target.loc, lines.join('\n'));
        })
        .catch(function (e) {
          app.warn('failed to write:', dir.target.loc, e);
        });
    }
  };

  // get the dotfiles
  var srcDir = app.backup + '/dotfiles';
  var targetDir = path.join(app.user, 'tmp');
  app.log('location:', srcDir).br();

  // read all files in dotfiles directory
  fs.readdirAsync(srcDir)
    .map(function (name) {
      var loc = path.join(srcDir, name);
      var targetLoc = path.join(targetDir, '.' + name); // where we'll create/symlink the file

      return fs.statAsync(loc).then(function (stat) {
        var source = {
          'isDirectory': stat.isDirectory(),
          'loc': loc,
          'name': name,
          'size': stat.size
        };
        var target = {
          'loc': targetLoc
        };

        return new File(source, target);
      });
    })
    .each(function (file) {
      // update each file with info on its target
      return fs.lstatAsync(file.target.loc)
        .then(function (stat) {
          file.target.exists = true;
          file.target.isLink = stat.isSymbolicLink();
        })
        .catch(function (e) {
          file.target.exists = false;
        });
    })
    .each(function (file) {
      // clean up targets
      var target = file.target;

      if (target.isLink) {
        file.unlink(file.target.loc); // remove the symlink
      } else if (target.exists) {
        file.backup(file.target); // back it up
      }
    })
    .each(function (file) {
      // point to sources
      var source = file.source;

      if (source.isDirectory) {
        file.sourceFiles(file); // create file with sources
      } else {
        file.symlink(source.loc, file.target.loc); // make a symlink
      }
    });

};
