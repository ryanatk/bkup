// setup user dotfiles

var Promise = require("bluebird");
var join = Promise.join;
var fs = Promise.promisifyAll(require('fs'));
var path = require('path-extra');

module.exports = function (app) {
  // dotfiles setup
  app.q.dotfiles = {
    'type': 'input',
    'name': 'dotfiles',
    'message': 'Now we\'ll setup your dotfiles',
    'default': 'ok',
    'when': function (answers) { app.log('answers:', answers);
      app.title ('DOTFILES'); // setup dotfiles
      return app.continue;
    },
    'validate': function (input) {
      if (input === 'n' || input === 'no') return false;

      // get the dotfiles
      var srcDir = path.join(app.user.bkup, 'dotfiles');
      var tgtDir = path.join(app.user.home);

      app.log('dotfiles location:', srcDir).br();

      fs.readdirAsync(srcDir) // get a list of all files in dotfiles directory
        .map(function (name) {
          if (app.ignore(name)) return; // ignore now, and we'll remove them later

          var loc = path.join(srcDir, name);
          var target = path.join(tgtDir, '.' + name); // where we'll create/symlink the file

          return fs.statAsync(loc).then(function (stat) { // gather info on each file

            return new app.file({
              'isDirectory': stat.isDirectory(),
              'loc': loc,
              'name': name,
              'target': target
            });
          });
        })
        .each(function (file) {
          // if target does not exist, no actions needed 
          if (!this.exists) return;

          // handle targets that already exist
          return fs.lstatAsync(file.target)
            .then(function (stat) {
              if (stat.isSymbolicLink()) {
                file.unlink(file.target); // remove the symlink
              } else {
                file.backup(file.target); // back it up
              }
            })
            .catch(function (e) {
              app.msg('target does not exist, no action needed', file.target, e);
            });
        })
        .each(function (file) {
          // TODO: if interactive, prompt for each rc

          if (file.isDirectory) {
            file.sourceFiles(srcDir); // create file with sources
            // TODO: check argv & prompt for env
            // TODO: comment out environment and os that don't match
            // TODO: always use main+private
          } else {
            file.symlink(loc, file.target); // make a symlink
          }
        })
        .catch(function (e) {
          app.warn('We cannot find your dotfiles', e);
        });

      return true;
    }
  };

};
