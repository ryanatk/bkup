// setup module used to attach helper/util functions and config props
// to a global var named app

var path = require('path-extra');

module.exports = function (app) {
  // log to console
  var logjs = require('./setup/log.js')(app);
  for (var key in logjs) {
    app[key] = logjs[key];
  }

  // holds prompt questions
  app.q = { continue: true };

  // util functions
  app.spawn = require('./setup/spawn.js'); // run sync cmd with output returned
  app.exec = require('./setup/exec.js')(app); // run async cmd with [callback]
  app.ignore = require('./setup/ignore.js');
  app.file = require('./setup/file.js');
  app.argv = require('./setup/argv.js')(app);

  // runtime properties
  app.root = __dirname;
  app.user = { home: path.homedir(), };
  app.debug = app.argv.debug;

  // config properties
  app.rc = require('./setup/rc.js')(app);
  app.os = require('./setup/os.js')(app);
  app.env = require('./setup/env.js')(app);
  app.user.backup = path.join(app.user.home, '.backup'); // TODO: allow argv

  return app;
};
