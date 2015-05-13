#!/usr/bin/env node

var exec = require('child_process').exec;

console.log('This does not work yet.');
console.log('Instead, run the following commands:');
exec('git config --global user.email', function (error, stdout) {
  console.log('ssh-keygen -t rsa -C "' + stdout.replace('\n', '') + '"');
  console.log('cat /Users/$USER/.ssh/id_rsa.pub | pbcopy');
});

/*
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var path = require('path-extra');

console.log('git config --global user.email');
exec('git config --global user.email', function (error, stdout) {
  console.log(error);
  console.log(stdout);
  console.log('ssh-keygen -t rsa -C "' + stdout.replace('\n', '') + '"');
  execSync('ssh-keygen -t rsa -C "' + stdout.replace('\n', '') + '"');
    exec('cat /Users/$USER/.ssh/id_rsa.pub | pbcopy', function (error, stdout) {
      console.log(error);
      console.log(stdout);
    });
});
*/
