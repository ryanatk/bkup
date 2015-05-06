// setup module used to attach helper/util functions and config props
// to a global var named app

var path = require('path-extra');

module.exports = function (app) {
  // log to console
  app.title = require('./setup/log.js').title;
  app.log = require('./setup/log.js').log;
  app.msg = require('./setup/log.js').msg;
  app.prop = require('./setup/log.js').prop;
  app.warn = require('./setup/log.js').warn;
  app.cmd = require('./setup/log.js').cmd;
  app.output = require('./setup/log.js').output;
  app.error = require('./setup/log.js').error;
  app.br = require('./setup/log.js').br;

  // util functions
  app.spawn = require('./setup/spawn.js');

  // config properties
  app.os = require('./setup/os.js')(app);
  app.argv = require('./setup/argv.js')(app);
  app.env = require('./setup/env.js')(app);
  app.user = path.homedir();
  app.root = __dirname;
  app.backup = app.user + '/.backup'; // TODO: allow argv

  return app;
};
