// check if git is installed
// if not, open install page in browser
// TODO: prompt to update to current version

module.exports = function install(app) {
  // ask for github username (add to .bkuprc)
  app.q.github = {
    'type': 'input',
    'name': 'github',
    'message': 'What is your github username?',
    'default': function () { return app.rc.data.github; },
    'when': function (answers) { app.log('answers:', answers);
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
  app.q.gitName = {
    'type': 'input',
    'name': 'gitName',
    'message': 'What is your name? (this name will be on your git commits)',
    'default': function () { return app.git.name; },
    'when': function (answers) { app.log('answers:', answers);
      // if we are reading from rc use rc.data
      var gitName = (answers.rc) ? app.rc.data.gitName : undefined;

      app.prop('git.name');
      return !gitName && app.q.continue;
    },
    'validate': function (input) {
      if (!input) return false;
      app.exec('git config --global user.name "' + input + '"');
      return app.rc.write('gitName', input);
    }
  };

  // set email
  app.q.gitEmail = {
    'type': 'input',
    'name': 'gitEmail',
    'message': 'What is your email address? (this will be on your git commits)',
    'default': function () { return app.git.email; },
    'when': function (answers) { app.log('answers:', answers);
      // if we are reading from rc use rc.data
      var gitEmail = (answers.rc) ? app.rc.data.gitEmail : undefined;

      app.prop('git.email');
      return !gitEmail && app.q.continue;
    },
    'validate': function (input) {
      if (!input) return false;
      app.exec('git config --global user.email "' + input + '"');
      return app.rc.write('gitEmail', input);
    }
  };


  // so i can do "git push" to push my current branch
  // git config --global push.default simple

  /*
    var completion = new File('git-completion.sh');
    completion.curl('https://raw.github.com/git/git/master/contrib/completion/git-completion.bash');

    var gprompt = new File('git-prompt.sh');
    gprompt.curl('https://raw.github.com/git/git/master/contrib/completion/git-prompt.sh');
  */

  // run command to check for git
  return {
    'gotIt': app.spawn('git --version').match(/^git version/),
    'name': app.spawn('git config user.name').replace('\n',''),
    'email': app.spawn('git config user.email').replace('\n','')
  };
};
