#!/usr/bin/env node

var Promise = require("bluebird");
var inquirer = require('inquirer');

/****  setup  ****/
var app = require('./setup.js')({});

//app.prop('q');
//app.prop('q.os');
//app.prop('q.env');

app.rc.data = app.rc.read(app);
app.prop('rc.data');

var q = app.q;
var prompts = [
  q.rc,
  q.os,
  q.env
];

inquirer.prompt(prompts, function (answers) {
    app.log('answers:', answers);

    for (var key in answers) {
      app.rc.data[key] = answers[key];
    }

    app.rc.write(app.rc.data);
      /*
    app.title('GIT'); // setup git
    var gotGit = require('./git.js')(app);

    if (!gotGit) return;
      */

});

//app.msg('index has run');

// prompt user for os and env


//app.title ('DOTFILES'); // setup dotfiles
//require('./dotfiles.js')(app);

//app.title ('DOWNLOADS'); // download software
//require('./downloads.js')(app);
