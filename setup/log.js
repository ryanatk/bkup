// helper to standardize log appearance

var prefix = ':';

module.exports = {
  'msg': function msg() {
    prefix = '"';
    log.apply(this, arguments);
  },

  'prop': function prop() {
    prefix = '@';
    log.apply(this, arguments);
  },

  'warn': function warn() {
    prefix = '!';
    log.apply(this, arguments);
  },

  'title': function title(txt) {
    console.log('');
    console.log('---------  ', txt, '  ---------');
    console.log('');
  }
};

function log() {
  var logs = [prefix],
      i = 0, len = arguments.length;

  for ( ; i < len; i++) {
    logs.push(arguments[i]);
  }

  // console.log accepts an array of arguments, so we must use apply
  console.log.apply(this, logs);
};
