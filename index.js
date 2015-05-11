#!/usr/bin/env node

var Promise = require("bluebird");
var inquirer = require('inquirer');

/****  setup  ****/
var app = require('./setup.js')({});

var q = app.prompts;
var prompts = [
  q.rc
, q.os
, q.env
, q.github
, q.name
/*
, q.email
, q.sshKey
, q.gitSetup
, q.bkupLoc
, q.bkupCloneURL
  */
];

inquirer.prompt(prompts, function (answers) {
  app.log('answers:', answers);
});

//app.title ('DOTFILES'); // setup dotfiles
//require('./dotfiles.js')(app);

//app.title ('DOWNLOADS'); // download software
//require('./downloads.js')(app);
