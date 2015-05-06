// take arguments from the command line execution

var argv = require('minimist')(process.argv.slice(2));

module.exports = function (app) {
  app.prop('argv =', argv);

  return argv;
};
