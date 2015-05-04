// setup module used to attach helper/util functions and config props
// to a global var named app

module.exports = function (app) {
  // util functions
  app.title = require('./setup/log.js').title;
  app.msg = require('./setup/log.js').msg;
  app.prop = require('./setup/log.js').prop;
  app.warn = require('./setup/log.js').warn;
  app.spawn = require('./setup/spawn.js');

  // config properties
  app.os = require('./setup/os.js')(app);

  return app;
};
