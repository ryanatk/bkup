// setup user dotfiles

var Promise = require("bluebird");
var join = Promise.join;
var fs = Promise.promisifyAll(require('fs'));
var path = require('path-extra');

module.exports = function (app) {
  // get the dotfiles
  var srcDir = path.join(app.user.backup, 'dotfiles');
  var tgtDir = path.join(app.user.home);

  app.log('location:', srcDir).br();

  fs.readdirAsync(srcDir) // get a list of all files in dotfiles directory
    .map(function (name) {
      if (app.ignore(name)) return; // ignore now, and we'll remove them later

      var loc = path.join(srcDir, name);
      var targetLoc = path.join(tgtDir, '.' + name); // where we'll create/symlink the file

      return fs.statAsync(loc).then(function (stat) { // gather info on each file

        return new app.file({
          'source': {
            'isDirectory': stat.isDirectory(),
            'loc': loc,
            'name': name,
            'size': stat.size
          },
          'target': {
            'loc': targetLoc
          }
        });
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
        file.unlink(target.loc); // remove the symlink
      } else if (target.exists) {
        file.backup(target.loc); // back it up
      }
    })
    .each(function (file) {
      // TODO: if interactive, prompt for each rc
      // point to sources
      var source = file.source;

      if (source.isDirectory) {
        file.sourceFiles(file); // create file with sources
        // TODO: check argv & prompt for env
        // TODO: comment out environment and os that don't match
        // TODO: always use main+private
      } else {
        file.symlink(source.loc, file.target.loc); // make a symlink
      }
    });

};
