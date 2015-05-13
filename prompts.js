// holds all the prompts

function isYes(input) {
  var affirmative = ['yes', 'y', 'yah', 'ok', 'okie', 'yeah'];
  return (affirmative.indexOf(input.toLowerCase()) !== -1);
}

module.exports = function (app) {
  return {
    rc: {
      'type': 'input',
      'name': 'rc',
      'message': 'Would you like to use your previous bkup configuration?',
      'default': 'yes',
      'when': function (answers) { app.log('answers:', answers);
        app.rc.backup();
        return app.rc.exists && app.continue;
      },
      'validate': function (input) {
        if (isYes(input))
          app.rc.useBkupRC();

        return true;
      }
    },

    os: {
      'type': 'input',
      'name': 'os',
      'message': 'What OS are you using?',
      'default': function () { return app.os.guess() || ''; },
      'when': function (answers) { app.log('answers:', answers);
        return !app.os.get() && app.continue;
      },
      'validate': function (input) {
        return app.rc.set('os', input);
      }
    },

    env: {
      'type': 'input',
      'name': 'env',
      'message': 'What environment are we setting up? [work, home, server]',
      'default': function () { return app.rc.data.env || ''; },
      'when': function (answers) { app.log('answers:', answers);
        return !app.env.get(answers.rc) && app.continue;
      },
      'validate': function (input) {
        return app.rc.set('env', input);
      }
    },

    gotGit: {
      'type': 'confirmation',
      'name': 'gotGit',
      'message': 'Please download and install git before continuing',
      'when': function (answers) { app.log('answers:', answers);
        return !app.git.gotGit() && app.continue; // if set in argv, don't ask
      }
    },

    // github username
    github: {
      'type': 'input',
      'name': 'github',
      'message': 'What is your github username?',
      'default': function () { return app.rc.data.github; },
      'when': function (answers) { app.log('answers:', answers);
        return !app.git.github(answers.rc) && app.continue; // if set in argv, don't ask
      },
      'validate': function (input) {
        return app.rc.set('github', input);
      }
    },

    // set name
    name: {
      'type': 'input',
      'name': 'name',
      'message': 'What is your name? (this name will be on your git commits)',
      'default': function () { return app.git.name.get(); },
      'when': function (answers) { app.log('answers:', answers);
        return !app.git.name.get() && app.continue;
      },
      'validate': function (input) {
        if (!input)
          return false; // this is required
        else
          app.git.name.set(input);

        return app.rc.set('name', input);
      }
    },

    // set email
    email: {
      'type': 'input',
      'name': 'email',
      'message': 'What is your email address? (this will be on your git commits)',
      'default': function () { return app.git.email.get(); },
      'when': function (answers) { app.log('answers:', answers);
        return !app.git.email.get() && app.continue;
      },
      'validate': function (input) {
        if (!input)
          return false; // this is required
        else
          app.git.email.set(input);

        return app.rc.set('email', input);
      }
    },

    // create & copy sshKey
    sshKey: {
      'type': 'input',
      'name': 'sshKey',
      'message': 'Do you want to update your ssh key in github?',
      'default': 'no',
      'when': function (answers) { app.log('answers:', answers);
        return app.continue;
      },
      'validate': function (input) {
        if (isYes(input))
          app.git.sshKey();

        return true;
      }
    },

    // git setup
    gitSetup: {
      'type': 'input',
      'name': 'gitSetup',
      'message': 'Now we\'ll setup your git completetion, git prompt, and settings',
      'default': 'yes',
      'when': function (answers) { app.log('answers:', answers);
        return app.continue;
      },
      'validate': function (input) {
        if (isYes(input))
          //app.git.setup();

        return true;
      }
    },



  };
};