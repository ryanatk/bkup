// read & write ~/.bkuprc to store options entered thru argv & prompts

var fs = require("fs");
var path = require('path-extra');

module.exports = function (app) {
  return {
    'read': function () {
      // read ~/.bkuprc
      app.rc.loc = path.join(app.user.home, '.bkuprc');
      app.rc.exists = fs.existsSync(app.rc.loc);
      var data = (app.rc.exists) ? JSON.parse(fs.readFileSync(app.rc.loc, 'utf8')) : {};

      // if not set on command line, prompt for rc location
      app.q.rc = {
        'type': 'list',
        'name': 'rc',
        'message': 'Would you like to use your previous bkup configuration?',
        'choices': ['yes', 'no'],
        'when': function (answers) {
          app.prop('rc.loc');
          return Object.keys(app.rc.data).length && app.q.continue; // if ~/.bkuprc doesn't exist, don't ask
        }
      };

      return data;
    },

    'write': function (obj) {
      if (app.rc.exists) {
        var File = app.file(app);
        File().backup(app.rc);
      }

      // on every change, write to app.rc and recreate ~/.bkuprc
      fs.writeFile(app.rc.loc, JSON.stringify(app.rc.data), 'utf8', function (err) {
        app.error(err);
        app.msg('Saved to', app.rc.loc);
      });

      return;
    }
  };
};
