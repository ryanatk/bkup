// ask which operating system we're using

module.exports = function (app) {
  // if not set on command line, prompt for os name
  app.q.os = {
    'type': 'input',
    'name': 'os',
    'message': 'What OS are you using?',
    'default': function () { return app.os || guessOS() || app.rc.data.os || ''; },
    'when': function (answers) { app.log('answers:', answers);
      // use argv first, or if we are reading from rc use rc.data
      app.os = app.os || (answers.rc) ? app.rc.data.os : undefined;

      app.prop('os');
      return !app.os && app.q.continue; // if set in argv, don't ask
    },
    'validate': function (input) {
      return app.rc.write('os', input);
    }
  };

  // if os is not set, provide a guess as the default
  function guessOS() {
    // check if mac
    if (app.spawn('sw_vers -productName', 'silent').match('Mac OS X'))
      return 'osx';

    // check if ubuntu
    if (app.spawn('lsb_release -i', 'silent').match('Ubuntu'))
      return 'ubuntu';
  }

  // get env from command line argv
  return app.argv.os;
};
