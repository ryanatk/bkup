// check which os we're using

module.exports = function (app) {
  var os;

  // check if mac
  if (app.spawn('sw_vers -productName', 'silent').match('Mac OS X'))
    os = 'osx';

  // check if ubuntu
  else if (app.spawn('lsb_release -i', 'silent').match('Ubuntu'))
    os = 'ubuntu';

  app.prop('app.os =', os);

  return os;
};
