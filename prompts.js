// holds all the prompts

function isYes(input) {
  console.log(input.toLowerCase() === 'yes' || input.toLowerCase() === 'y');
  return (input.toLowerCase() === 'yes' || input.toLowerCase() === 'y');
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
        app.useRC = (input.toLowerCase() === 'yes' || input.toLowerCase() === 'y');
        if (app.useRC)
          app.rc.read();

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

    // github username
    github: {
      'type': 'input',
      'name': 'github',
      'message': 'What is your github username?',
      'default': function () { return app.rc.data.github; },
      'when': function (answers) { app.log('answers:', answers);
        app.msg(app.git.github);
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
      'default': function () { return app.git.name; },
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
    }

  };

};
