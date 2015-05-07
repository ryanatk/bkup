#!/usr/bin/env node

var app = require('./setup.js')({});

/****  setup  ****/

// prompt user for os and env

//app.title('GIT'); // setup git
require('./git.js')(app);

//app.title ('DOTFILES'); // setup dotfiles
require('./dotfiles.js')(app);

//app.title ('DOWNLOADS'); // download software
require('./downloads.js')(app);
