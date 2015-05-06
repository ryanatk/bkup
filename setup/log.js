// helper to standardize log appearance

module.exports = (function () {
  var prefix;
  var Log = function log(prefix) {
    if (!(this instanceof Log)) // saves us from needing to use the new keyword every time
      return new Log(prefix);

    this.prefix = prefix || '';
  };

  Log.prototype = {
    'print': function () {
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

    'prop': function prop() {
      return Log('@').print(arguments);
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
      var msg = Log('! ERROR:').print([err]);

      if (typeof callback !== 'undefined') { callback(err); }
      return msg;
    },

    'title': function title(txt) {
      return Log().br().print(['---------  ', txt, '  ---------']).br();
    }
  };
})();
