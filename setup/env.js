// prompt user for their environment (work, home, school, server, etc)

module.exports = function (app) {
  return {
    get: function get() {
      // use argv first, or if we are reading from rc use rc.data
      var env = app.argv.env || (app.useRC) ? app.rc.data.env : undefined;

      return env;
    }
  };
};
