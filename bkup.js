// setup your ~/.bkup from github

var path = require('path-extra');

module.exports = function install(app) {
  return {
    loc: {
      get: function () {
        // if we are reading from rc use rc.data
        var loc = (app.useRC) ? app.rc.data.bkupLoc : undefined;
        if (loc)
          app.user.bkup = app.file(loc);

        return loc;
      },
      set: function (input) {
        app.user.bkup = app.file(input);
        return app.user.bkup.exists;
      },
      default: function () {
        return app.bkup.loc.get() || path.join(app.user.home, '.backup');
      }
    },

    cloneURL: {
      get: function () {
        return (app.useRC) ? app.rc.data.bkupCloneURL : undefined;
      },

      set: function (input) {
        app.file(app.user.bkup).clone(input);
        return true;
      },
      default: function () {
        return app.bkup.cloneURL.get() || 'git@github.com:' + app.rc.data.github + '/bkup.git';
      }
    }
  };
};
