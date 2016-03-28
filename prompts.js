// config properties
var rc = require('./setup/rc.js')(app);
var os = require('./setup/os.js')(app);
var env = require('./setup/env.js')(app);

// prompts and scripts
var git = require('./git.js')(app);
var bkup = require('./bkup.js')(app);
var dotfiles = require('./dotfiles.js')(app);
var downloads = require('./downloads.js')(app);

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
        rc.backup();
        return rc.exists && app.continue;
      },
      'validate': function (input) {
        if (isYes(input))
          rc.useBkupRC();

        return true;
      }
    },

    os: {
      'type': 'input',
      'name': 'os',
      'message': 'What OS are you using?',
      'default': function () { return os.guess() || ''; },
      'when': function (answers) { app.log('answers:', answers);
        return !os.get() && app.continue;
      },
      'validate': function (input) {
        return rc.set('os', input);
      }
    },

    env: {
      'type': 'input',
      'name': 'env',
      'message': 'What environment are we setting up? [work, home, server]',
      'default': function () { return rc.data.env || ''; },
      'when': function (answers) { app.log('answers:', answers);
        return !env.get(answers.rc) && app.continue;
      },
      'validate': function (input) {
        return rc.set('env', input);
      }
    },

    gotGit: {
      'type': 'confirmation',
      'name': 'gotGit',
      'message': 'Please download and install git before continuing',
      'when': function (answers) { app.log('answers:', answers);
        return !git.gotGit() && app.continue; // if set in argv, don't ask
      }
    },

    // github username
    github: {
      'type': 'input',
      'name': 'github',
      'message': 'What is your github username?',
      'default': function () { return rc.data.github; },
      'when': function (answers) { app.log('answers:', answers);
        return !git.github(answers.rc) && app.continue; // if set in argv, don't ask
      },
      'validate': function (input) {
        return rc.set('github', input);
      }
    },

    // set name
    name: {
      'type': 'input',
      'name': 'name',
      'message': 'What is your name? (this name will be on your git commits)',
      'default': function () { return git.name.get(); },
      'when': function (answers) { app.log('answers:', answers);
        return !git.name.get() && app.continue;
      },
      'validate': function (input) {
        if (!input)
          return false; // this is required
        else
          git.name.set(input);

        return rc.set('name', input);
      }
    },

    // set email
    email: {
      'type': 'input',
      'name': 'email',
      'message': 'What is your email address? (this will be on your git commits)',
      'default': function () { return git.email.get(); },
      'when': function (answers) { app.log('answers:', answers);
        return !git.email.get() && app.continue;
      },
      'validate': function (input) {
        if (!input)
          return false; // this is required
        else
          git.email.set(input);

        return rc.set('email', input);
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
          git.sshKey();

        return true;
      }
    },

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
          //git.setup();

        return true;
      }
    },

    bkupLoc: {
      'type': 'input',
      'name': 'bkupLoc',
      'message': 'Where would you like to store your bkup files?',
      'default': function () { return bkup.loc.default(); },
      'when': function (answers) { app.log('answers:', answers);
        return !bkup.loc.get() && app.continue;
      },
      'validate': function (input) {
        bkup.loc.set(input)
        return rc.set('bkupLoc', input);
      }
    },

    bkupCloneURL: {
      'type': 'input',
      'name': 'bkupCloneURL',
      'message': 'Looks like we need to download your bkup files. What github repo can we find them?',
      'default': function () { return bkup.cloneURL.default(); },
      'when': function (answers) { app.log('answers:', answers);
        return !app.user.bkup.exists && app.continue;
      },
      'validate': function (input) {
        // if we're cloning, we need to stop running more questions
        app.continue = false;

        bkup.cloneURL.set(input);
        return rc.set('bkupCloneURL', input);
      }
    },

    dotfiles: {
      'type': 'input',
      'name': 'dotfiles',
      'message': 'Now we\'ll setup your dotfiles',
      'default': 'ok',
      'when': function (answers) { app.log('answers:', answers);
        return app.continue;
      },
      'validate': function (input) {
        if (isYes(input))
          dotfiles();

        return true;
      }
    },

    downloads: {
      'type': 'input',
      'name': 'downloads',
      'message': 'Now we\'ll download ALL THE THINGS',
      'default': 'ok',
      'when': function (answers) { app.log('answers:', answers);
        return app.continue;
      },
      'validate': function (input) {
        if (isYes(input))
          downloads();

        return true;
      }
    }

  };
};
