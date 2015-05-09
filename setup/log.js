// helper to standardize log appearance

module.exports = function (app) {
  var prefix;
  var Log = function log(prefix) {
    if (!(this instanceof Log)) // saves us from needing to use the new keyword every time
      return new Log(prefix);

    this.prefix = prefix || '';
  };

  Log.prototype = {
    'print': function () {
      if (!app.debug) return;

      var logs = [this.prefix];
      var args = arguments[0] || []; // passing in arguments as arguments (array in an array)

      var i = 0, len = args.length;
      for ( ; i < len; i++) {
        logs.push(args[i]);
      }

      console.log.apply(this, logs); // console.log accepts an array of arguments, so we must use apply

      return this;
    },

    'br': function () {
      console.log(''); // print a blank line
      return this;
    }
  };

  return {
    'log': function log() {
      return Log(':').print(arguments);
    },

    'msg': function msg() {
      return Log('"').print(arguments);
    },

    // take a key of app, and build a useful message
    'prop': function prop() {
      var key = arguments[0].split('.')[0];
      var sub = arguments[0].split('.')[1];
      var val = sub ? app[key][sub] : app[key];

      var args = ['app.' + arguments[0], '=', typeof val + ',', !!val + ',', val];
      var i = 1, len = arguments.length; // start with 1, since we've already used index 0

      for ( ; i < len; i++) {
        args.push(arguments[i]);
      }

      return Log('@').print(args);
    },

    'warn': function warn() {
      return Log('! ERROR:').print(arguments);
    },

    'cmd': function cmd() {
      return Log('$').print(arguments);
    },

    'output': function output() {
      return Log('>').print(arguments);
    },

    'br': function br() {
      return Log().print();
    },

    'error': function error(err, callback) {
      if (!err) return;

      var msg = Log('! ERROR:').print([err]);

      if (typeof callback !== 'undefined') { callback(err); }
      return msg;
    },

    'title': function title(txt) {
      return Log().print(['---------  ', txt, '  ---------']);
      // TODO: title function creates a new 'group', where Log can push to, so a group of logs can be printed together at once
      // (not necessary if i can run each group synchronously, using prompts)
    }
  };
};
