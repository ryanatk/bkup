// prototype object for files

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs-extra'));
var request = Promise.promisifyAll(require('request'));

module.exports = function (app) {
  var timestamp = new Date().getTime();
  var File = function (args) {
    if (!(this instanceof File)) // saves us from needing to use the new keyword every time
      return new File(args);

    app.log('+++', typeof args, args);
    if (typeof args === 'string') {
      this.loc = args;
    } else if (typeof args === 'object') {
      for (var key in args) {
        this[key] = args[key];
      }
    }

    this.exists = fs.existsSync(this.loc);
    // TODO: existsSync will be deprecated, but how else can i set this.exists synchronously? (i use it in prompt validation)

    app.log('+++', this);
    return this;
  };

  File.prototype = {
    // remove existing symlink
    unlink: function unlink(loc) {
      if (!this.exists) return this;

      loc = loc || this.loc;
      fs.unlinkAsync(loc)
        .then(function () {
          app.msg('Removed link:', loc);
        })
        .catch(function (e) {
            app.log('&&&', typeof loc, loc)
          app.msg('Could not remove link:', loc, e);
        });

      return this;
    },

    // create a symlink from dotfile location to target code
    symlink: function symlink(src, tgt) {
      if (this.exists) return this;

      return fs.symlinkAsync(src, tgt)
        .then(function () {
          app.msg('Added symlink:', src, '->', tgt);
        })
        .catch(function (e) {
          app.warn('Could not create symlink:', tgt, e);
        });
    },

    // backup the file, adding timestamp
    backup: function backup(loc) {
      loc = loc || this.loc;
      var oldPath = loc;
      var newPath = oldPath + '.bkup.' + timestamp;

      return fs.copyAsync(oldPath, newPath)
        .then(function () {
          app.log('Created backup:', newPath);
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

    clone: function curl(url, loc) {
      loc = loc || this.loc;
      app.spawn('git clone ' + url + ' ' + loc);
      return this;
    },

    curl: function curl(url, loc) {
      if (this.exists) return this;

      loc = loc || this.loc;
      // download from url and write to file
      request({'uri': url}, function (err, res, body) {
        if (err || !body) {
          console.log('Failed to download:', url);
        } else {
          console.log('Success downloaded:', url);
          fs.writeFile(loc, body);
        }
      });
      return this;
    },

    download: function download(url, loc) {
      if (this.exists) return this;

      // request url (DIRECT CALL TO `request` NOT PROMISIFIED (for streaming))
      request(url)
        // stream the file directly to disk
        .pipe(fs.createWriteStream(loc))
        // TODO: add progress bars
        .on('close',function(){
          app.log('Downloading:', url, '=>', loc)
          app.spawn('open ' + loc);
        })
        .on('error',function(e){
          console.error('problem downloading: ' + filename);
        });

      return this;
    },

    read: function () {
      this.data = fs.readFileSync(this.loc, 'utf8');
      return this;
    },

    write: function (data) {
      fs.writeFileAsync(this.loc, data, 'utf8')
        .then(function (file) {
          app.msg('Wrote file:', file.loc);
        })
        .catch(function (err) {
          app.error(err);
        });

      return this;
    }
  };

  return File;
};
