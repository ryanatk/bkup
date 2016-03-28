// ask which operating system we're using

module.exports = function (app) {
  return {
    get: function get() {
      // use argv first, or if we are reading from rc use rc.data
      var os = app.argv.os || (app.useRC) ? app.rc.data.os : undefined;

      return os;
    },

    // if os is not set, provide a guess as the default
    guess: function guess() {
      // check if mac
      if (app.spawn('sw_vers -productName', 'silent').match('Mac OS X'))
        return 'osx';

      // check if ubuntu
      if (app.spawn('lsb_release -i', 'silent').match('Ubuntu'))
        return 'ubuntu';
    }
  };
};
