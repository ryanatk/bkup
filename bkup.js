// setup your ~/.bkup from github

module.exports = function install(app) {
  var bkup;

  app.q.bkupLoc = {
    'type': 'input',
    'name': 'bkupCloneURL',
    'message': 'Where would you like to store your bkup files?',
    'default': function () { return bkup.loc; },
    'when': function (answers) { app.log('answers:', answers);
      // if we are reading from rc use rc.data
      var loc = (answers.rc) ? app.rc.data.bkupLoc : app.user.bkup;
      bkup = app.file(loc);

      return app.q.continue;
    },
    'validate': function (input) {
      bkup.loc = input;
      return app.rc.write('bkupLoc', input);
    }
  };

  app.q.bkupCloneURL = {
    'type': 'input',
    'name': 'bkupCloneURL',
    'message': 'Looks like we need to download your bkup files. What github repo can we find them?',
    'default': function () { return app.rc.data.bkupCloneURL || app.bkup.cloneURL(); },
    'when': function (answers) { app.log('answers:', answers);
      // if we are reading from rc use rc.data
      var cloneURL = (answers.rc) ? app.rc.data.bkupClone : undefined;

      return !bkup.exists && !cloneURL && app.q.continue;
    },
    'validate': function (input) {
      // if we're cloning, we need to stop running more questions
      app.q.continue = false;

      bkup.clone(input);
      return app.rc.write('bkupCloneURL', input);
    }
  };

  return {
    'cloneURL': function () { return 'git@github.com:' + app.rc.data.github + '/backup.git'; }
  };
};
