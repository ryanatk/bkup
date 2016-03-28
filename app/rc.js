// read & write ~/.bkuprc to store options entered thru argv & prompts

var path = require('path-extra');

module.exports = function (app) {
  var loc = path.join(app.user.home, '.bkuprc');
  var rc = app.file(loc);

  rc.data = {};

  rc.useBkupRC = function () {
    app.useRC = true;
    app.rc.read(function (data) {
      return JSON.parse(data);
    });
  };

  rc.set = function (key, val) {
    app.rc.data[key] = val;
    rc.write(JSON.stringify(app.rc.data));

    return true;
  };

  return rc;
};
