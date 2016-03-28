#!/usr/bin/env node

var inquirer = require('inquirer');

/****  setup  ****/
var app = require('./setup.js')({});

var q = app.prompts;
var prompts = [
  q.rc
, q.os
, q.env
, q.gotGit
, q.github
, q.name
, q.email
, q.sshKey
, q.gitSetup
, q.bkupLoc
, q.bkupCloneURL
, q.dotfiles
, q.downloads
];

inquirer.prompt(prompts, function (answers) {
  app.log('answers:', answers);
});

//app.title ('DOTFILES'); // setup dotfiles
//require('./dotfiles.js')(app);

//app.title ('DOWNLOADS'); // download software
//require('./downloads.js')(app);
