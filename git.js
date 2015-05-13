// check if git is installed
// if not, open install page in browser
// TODO: prompt to update to current version

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var path = require('path-extra');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var execFile = require('child_process').execFile;

module.exports = function (app) {
  return {
    gotGit: function () {
      var gotGit = app.spawn('git --version').match(/^git version/);
      if (!gotGit) {
        app.exec('open http://git-scm.com/downloads');
        app.continue = false;
      }

      return gotGit;
    },

    github: function () {
      // use argv first, or if we are reading from rc use rc.data
      return (app.useRC) ? app.rc.data.github : undefined;
    },

    name: {
      get: function () {
        // if we are reading from rc use rc.data
        return (app.useRC) ? app.rc.data.name : undefined;
      },
      set: function (input) {
        // set name in .gitconfig
        return app.exec('git config --global user.name "' + input + '"');
      }
    },

    email: {
      get: function () {
        // if we are reading from rc use rc.data
        var email = (app.useRC) ? app.rc.data.email : undefined;

        return email;
      },
      set: function (input) {
        // set email in .gitconfig
        return app.exec('git config --global user.email "' + input + '"');
      }
    },

    // create & copy sshKey
    sshKey: function () {
      app.exec('open -a Terminal "' + path.join(app.root, 'scripts', 'ssh-keygen.js') + '"');
      app.exec('open https://github.com/settings/ssh');
    },

    setup: function () {
      // so i can do "git push" to push my current branch
      app.exec('git config --global push.default simple');

      app.file(path.join(app.user.home, '.git-completion.sh'))
        .curl('https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash');

      app.file(path.join(app.user.home, '.git-prompt.sh'))
        .curl('https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh');
    }

  };
};
