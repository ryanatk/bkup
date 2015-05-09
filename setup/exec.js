// util to run command line processes, with no feedback in the console
var exec = require('child_process').exec;

// accepts a string to be run on the command line
module.exports = function (app) {
  return function (cmd, callback) {
    app.cmd(cmd);

    exec(cmd, function (error) {
      app.error(error);
    });
  };
};
