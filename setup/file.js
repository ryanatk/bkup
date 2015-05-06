// prototype object for files

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var request = Promise.promisifyAll(require('request'));

module.exports = function (app) {
  var timestamp = new Date().getTime();
  var File = function (obj) {
    if (!(this instanceof File)) // saves us from needing to use the new keyword every time
      return new File(obj);

    for (var key in obj) {
      this[key] = obj[key];
    }
  };

  File.prototype = {
    // remove existing symlink
    unlink: function unlink(loc) {
      app.msg('Removed link:', loc);
      return fs.unlinkAsync(loc);
    },

    // create a symlink from dotfile location to target code
    symlink: function symlink(src, tgt) {
      return fs.symlinkAsync(src, tgt)
        .then(function () {
          app.msg('Added symlink:', src, '->', tgt);
        })
        .catch(function (e) {
          app.warn('Could not create symlink:', tgt, e);
        });
    },

    // backup the file, adding timestamp
    backup: function backup(target) {
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

    sourceFiles: function sourceFiles(dir) {
      var srcDir = dir.source.loc;

      // setup buffer to hold lines
      var lines = ['#!/bin/bash',''];

      return fs.readdirAsync(srcDir)
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
    },

    download: function download(url, loc) {
      // request url (DIRECT CALL TO `request` NOT PROMISIFIED (for streaming))
      request(url)
        // stream the file directly to disk
        .pipe(fs.createWriteStream(loc))
        // TODO: add progress bars
        .on('close',function(){
          app.spawn('open ' + loc);
        })
        .on('error',function(e){
          console.error('problem downloading: ' + filename);
        });

      return app.log('Downloading:', url, '=>', loc);
    }
  };

  return File;
};
