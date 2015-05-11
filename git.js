// check if git is installed
// if not, open install page in browser
// TODO: prompt to update to current version

var fs = require('fs-extra');
var path = require('path-extra');

module.exports = function (app) {
  return {
    github: function () {
      app.title ('GIT'); // setup dotfiles
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
    }
  };

            /*

  // set email
  app.q.email = {
    'type': 'input',
    'name': 'email',
    'message': 'What is your email address? (this will be on your git commits)',
    'default': function () { return app.git.email; },
    'when': function (answers) { app.log('answers:', answers);
      // if we are reading from rc use rc.data
      var email = (answers.rc) ? app.rc.data.email : undefined;

      app.prop('git.email');
      return !email && app.continue;
    },
    'validate': function (input) {
      if (!input) return false; // this is required

      // set email in .gitconfig
      app.exec('git config --global user.email "' + input + '"');
      return app.rc.write('email', input);
    }
  };

  var sshKeyLoc = path.join(app.user.home, '.ssh/id_rsa.pb');

  // set email
  app.q.sshKey = {
    'type': 'input',
    'name': 'sshKey',
    'message': 'Do you want to update your ssh key in github?',
    'default': 'no',
    'when': function (answers) { app.log('answers:', answers);
      // if sshKeyLoc does not exist, run ssh-keygen
      return fs.readFileAsync(sshKeyLoc, 'utf8')
        .then(function () {
          return true;
        })
        .catch(function (e) {
          app.spawn('ssh-keygen -t rsa -C "' + app.rc.data.email + '"');
          app.continue = false;
          return app.continue;
        });
    },
    'validate': function (input) {
      if (isYes) {
        app.exec('cat ' + sshKeyLoc + ' | pbcopy');
        app.exec('open https://github.com/settings/ssh');
      }
      return true;
    }

  // git setup
  app.q.gitSetup = {
    'type': 'input',
    'name': 'gitSetup',
    'message': 'Now we\'ll setup your git completetion, git prompt, and settings',
    'default': 'ok',
    'when': function (answers) { app.log('answers:', answers);
      return app.continue;
    },
    'validate': function (input) {
      if (input === 'n' || input === 'no') return false;

      // so i can do "git push" to push my current branch
      app.exec('git config --global push.default simple');

      app.file(path.join(app.user.home, '.git-completion.sh'))
        .curl('https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash');

      app.file(path.join(app.user.home, '.git-prompt.sh'))
        .curl('https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh');

      return true;
    }
  };

  // run command to check for git
  return {
    'gotIt': app.spawn('git --version').match(/^git version/),
    'name': app.spawn('git config user.name').replace('\n',''),
    'email': app.spawn('git config user.email').replace('\n','')
            */
};
