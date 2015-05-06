// setup module used to attach helper/util functions and config props
// to a global var named app

var path = require('path-extra');

module.exports = function (app) {
  // log to console
  var logjs = require('./setup/log.js');
  for (var key in logjs) {
    app[key] = logjs[key];
  }

  // util functions
  app.spawn = require('./setup/spawn.js');
  app.ignore = require('./setup/ignore.js');
  app.file = require('./setup/file.js');

  // config properties
  app.os = require('./setup/os.js')(app);
  app.argv = require('./setup/argv.js')(app);
  app.env = require('./setup/env.js')(app);
  app.user = path.homedir();
  app.root = __dirname;
  app.backup = app.user + '/.backup'; // TODO: allow argv

  return app;
};
