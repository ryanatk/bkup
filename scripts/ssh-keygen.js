#!/usr/bin/env node

var exec = require('child_process').exec;
var path = require('path-extra');

exec('git config --global user.email', function (error, stdout) {
  console.log();
  exec('ssh-keygen -t rsa -C "' + stdout.replace('\n', '') + '"', function (error) {
    exec('cat ' + path.join(app.user.home, '.ssh/id_rsa.pb') + ' | pbcopy');
    exec('open https://github.com/settings/ssh');
  });
});
