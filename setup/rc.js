// read & write ~/.bkuprc to store options entered thru argv & prompts

var fs = require("fs");
var path = require('path-extra');

module.exports = function (app) {
  var loc = path.join(app.user.home, '.bkuprc');
  var exists = fs.existsSync(loc);

  app.q.rc = {
    'type': 'confirm',
    'name': 'rc',
    'message': 'Would you like to use your previous bkup configuration?',
    'when': function (answers) { app.log('answers:', answers);
      // read ~/.bkuprc
      app.rc.data = (exists) ? JSON.parse(fs.readFileSync(loc, 'utf8')) : {};

      // back it up
      if (exists)
        app.file().backup(loc);

      // if data exists, that means the file exists, so we should ask
      app.prop('rc');
      return exists && app.q.continue;
    }
  };

  return {
    // on every change, write to app.rc and recreate ~/.bkuprc
    'write': function (key, val) {
      app.rc.data[key] = val;

      fs.writeFile(loc, JSON.stringify(app.rc.data), 'utf8', function (err) {
        app.error(err);
      });
      return true;
    }
  };
};
