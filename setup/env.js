// prompt user for their environment
// (work, home, school, server, etc)

var inquirer = require('inquirer');

module.exports = function (app) {
  app.prop('env =', app.argv.env);

  return 'work';
};
