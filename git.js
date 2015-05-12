// check if git is installed
// if not, open install page in browser
// TODO: prompt to update to current version

var fs = require('fs-extra');
var path = require('path-extra');

module.exports = function (app) {
  return {
    github: function () {
      var github;
      var gotGit = app.spawn('git --version').match(/^git version/);

      // if we don't have git yet, don't bother continuing
      if (gotGit) {
        // use argv first, or if we are reading from rc use rc.data
        github = (app.useRC) ? app.rc.data.github : undefined;
      } else {
        app.msg('Please download and install git before continuing');
        app.exec('open http://git-scm.com/downloads');
        app.continue = false;
      }

      return gotGit;
    },

    // set name
    name: {
      get: function () {
        // if we are reading from rc use rc.data
        var name = (app.useRC) ? app.rc.data.name : undefined;

        return name;
      },
      set: function (input) {
        // set name in .gitconfig
        app.exec('git config --global user.name "' + input + '"');
        return app.rc.write('name', input);
      }
    },

    // set email
    email: {
      get: function () {
        // if we are reading from rc use rc.data
        var email = (app.useRC) ? app.rc.data.email : undefined;

        return email;
      },
      set: function (input) {
        // set email in .gitconfig
        app.exec('git config --global user.email "' + input + '"');
        return app.rc.write('email', input);
      }
    },

    // create & copy sshKey
    sshKey: function () {
      var sshKeyLoc = path.join(app.user.home, '.ssh/id_rsa.pb');

      // if sshKeyLoc does not exist, run ssh-keygen
      fs.readFileAsync(sshKeyLoc, 'utf8')
        .then(function () {
          app.exec('cat ' + sshKeyLoc + ' | pbcopy');
          app.exec('open https://github.com/settings/ssh');
        })
        .catch(function (e) {
          app.exec('open -a Terminal "' + path.join(app.root, 'scripts', 'ssh-keygen.js') + '"');
        });
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
