// setup user dotfiles

var Promise = require("bluebird");
var join = Promise.join;
var fs = Promise.promisifyAll(require('fs'));
var path = require('path-extra');

module.exports = function (app) {
  return function () {
    // get the dotfiles
    var srcDir = path.join(app.rc.data.bkupLoc, 'dotfiles');
    var tgtDir = path.join(app.user.home);

    fs.readdirAsync(srcDir) // get a list of all files in dotfiles directory
      .map(function (name) {
        if (app.ignore(name)) return; // ignore now, and we'll remove them later

        var loc = path.join(srcDir, name);
        var target = path.join(tgtDir, '.' + name); // where we'll create/symlink the file

        var file = app.file({
          'loc': loc,
          'name': name,
          'target': target,
          'isDirectory': false
        }).unlink().backup(target)

        return file;
      })
      .each(function (file) {
        fs.statAsync(file.loc)
          .then(function (stat) {
            if (stat.isDirectory())
              file.sourceFiles(); // create file with sources
            else
              file.symlink(); // make a symlink
            // TODO: check argv & prompt for env
            // TODO: if interactive, prompt for each rc
            // TODO: comment out environment and os that don't match
            // TODO: always use main+private
          })
          .catch(function (e) {
            console.log('+++', file.name, e);
          });
      })
      .catch(function (e) {
        app.warn('We cannot find your dotfiles', e);
      });

    return true;
  };

};
