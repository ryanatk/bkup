// check if git is installed
// if not, open install page in browser
// TODO: prompt to update to current version

var fs = require('fs-extra');
var path = require('path-extra');

module.exports = function install(app) {
  // ask for github username (add to .bkuprc)
  app.q.github = {
    'type': 'input',
    'name': 'github',
    'message': 'What is your github username?',
    'default': function () { return app.rc.data.github; },
    'when': function (answers) { app.log('answers:', answers);
      app.title ('GIT'); // setup dotfiles
      var github;

      // if we don't have git yet, don't bother continuing
      if (!app.git.gotIt) {
        app.msg('Please download and install git before continuing');
        app.spawn('open http://git-scm.com/downloads');
        app.q.continue = false;
      } else {
        // use argv first, or if we are reading from rc use rc.data
        github = (answers.rc) ? app.rc.data.github : undefined;
      }

      app.prop('git.gotIt');
      return !github && app.q.continue; // if set in argv, don't ask
    },
    'validate': function (input) {
      return app.rc.write('github', input);
    }
  };

  // set name
  app.q.name = {
    'type': 'input',
    'name': 'name',
    'message': 'What is your name? (this name will be on your git commits)',
    'default': function () { return app.git.name; },
    'when': function (answers) { app.log('answers:', answers);
      // if we are reading from rc use rc.data
      var name = (answers.rc) ? app.rc.data.name : undefined;

      app.prop('git.name');
      return !name && app.q.continue;
    },
    'validate': function (input) {
      if (!input) return false;
      app.exec('git config --global user.name "' + input + '"');
      return app.rc.write('name', input);
    }
  };

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
      return !email && app.q.continue;
    },
    'validate': function (input) {
      if (!input) return false;
      app.exec('git config --global user.email "' + input + '"');
      return app.rc.write('email', input);
    }
  };

  // set email
  app.q.sshKey = {
    'type': 'confirm',
    'name': 'sshKey',
    'message': 'Update your ssh key in github (we\'ll copy this to your clipboard)',
    'default': function () { return app.git.email; },
    'when': function (answers) { app.log('answers:', answers);
      var sshKey = path.join(app.user.home, '.ssh/id_rsa.pub');
      fs.readFileAsync(sshKey)
        .then(function () {
          app.exec('cat ' + sshKey + ' | pbcopy');
          app.exec('open https://github.com/settings/ssh');
        })
        .catch(function (e) {
          app.exec('ssh-keygen -t rsa -C "' + app.rc.data.email + '"');
          app.exec('cat ' + sshKey + ' | pbcopy');
          app.exec('open https://github.com/settings/ssh');
        });
      return app.q.continue;
    }
  };

  // git setup
  app.q.gitSetup = {
    'type': 'input',
    'name': 'gitSetup',
    'message': 'Now we\'ll setup your git completetion, git prompt, and settings',
    'default': 'ok',
    'when': function (answers) { app.log('answers:', answers);
      return app.q.continue;
    },
    'validate': function (input) {
      if (input === 'n' || input === 'no') return false;

      // so i can do "git push" to push my current branch
      app.exec('git config --global push.default simple');

      app.file(path.join(app.user.home, '.git-completion.sh'))
        .curl('https://raw.github.com/git/git/master/contrib/completion/git-completion.bash');

      app.file(path.join(app.user.home, '.git-prompt.sh'))
        .curl('https://raw.github.com/git/git/master/contrib/completion/git-prompt.bash');

      return true;
    }
  };

  // run command to check for git
  return {
    'gotIt': app.spawn('git --version').match(/^git version/),
    'name': app.spawn('git config user.name').replace('\n',''),
    'email': app.spawn('git config user.email').replace('\n','')
  };
};
