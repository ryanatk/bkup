// ask which operating system we're using

module.exports = function (app) {
  var os = app.argv.os;
  var q;

  // if os is not set, guess and change the question
  var guessOS = function () {
    // check if mac
    if (app.spawn('sw_vers -productName', 'silent').match('Mac OS X'))
      return 'osx';

    // check if ubuntu
    if (app.spawn('lsb_release -i', 'silent').match('Ubuntu'))
      return 'ubuntu';
  };

  // if not set on command line, prompt for os name
  app.q.os = {
    'type': 'input',
    'name': 'os',
    'message': 'What OS are you using?',
    'default': os || guessOS(),
    'when': function (answers) {
      app.os = app.os || (answers.rc === 'yes') ? app.rc.data.os : undefined;
      app.prop('os');
      return !app.os && app.q.continue; // if set in argv, don't ask
    }
  };

  return os;
};
