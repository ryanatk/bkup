// prompt user for their environment (work, home, school, server, etc)

module.exports = function (app) {
  // if not set on command line, prompt for environment name
  app.q.env = {
    'type': 'input',
    'name': 'env',
    'message': 'What environment are we setting up? [work, home, server]',
    'default': function () { return app.rc.data.env || ''; },
    'when': function (answers) { app.log('answers:', answers);
      // use argv first, or if we are reading from rc use rc.data
      app.env = app.env || (answers.rc) ? app.rc.data.env : undefined;

      app.prop('env');
      return !app.env && app.q.continue;
    },
    'validate': function (input) {
      if (!input) return false;
      return app.rc.write('env', input);
    }
  };

  // get env from command line argv
  return app.argv.env;
};
