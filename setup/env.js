// prompt user for their environment
// (work, home, school, server, etc)

var inquirer = require('inquirer');

module.exports = function (app) {
  // get env from command line argv
  var env = app.argv.env;

  // if not set on command line, prompt for environment name
  app.q.env = {
    'type': 'input',
    'name': 'env',
    'message': 'What environment are we setting up? [work, home, server]',
    'when': function (answers) {
      app.prop('env');
      return !app.env && app.q.continue;
    }
  };

  return env;
};
