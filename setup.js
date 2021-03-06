// setup module used to attach helper/util functions and config props
// to a global var named app

var path = require('path-extra');

module.exports = function (app) {
  // log to console
  var logjs = require('./setup/log.js')(app);
  for (var key in logjs) {
    app[key] = logjs[key];
  }

  // util functions
  app.spawn = require('./setup/spawn.js'); // run sync cmd with output returned
  app.exec = require('./setup/exec.js')(app); // run async cmd with [callback]
  app.ignore = require('./setup/ignore.js');
  app.file = require('./setup/file.js')(app);
  app.argv = require('./setup/argv.js')(app);

  // runtime properties
  app.root = __dirname;
  app.user = { home: path.homedir(), };
  app.debug = app.argv.debug;
  app.q = {};
  app.continue = true;

  return app;
};
