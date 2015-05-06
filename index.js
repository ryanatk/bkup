#!/usr/bin/env node

var app = require('./setup.js')({});

/****  setup  ****/
app.title('GIT');
require('./git.js')(app); // setup git

app.title ('DOTFILES');
require('./dotfiles.js')(app); // setup dotfiles

// prompt user for os and env

/****  rc files  ****/
// if dir, prompt for variants
  // use os & env from setup
  // always use main+private
  // prompt for anything else

// setup bash_profile to load bashrc
  // create new bash_profile? or append?

/****  downloads  ****/
// download (and execute?) all dmg's
  // download to a local folder (tmp?) that goes in .gitignore
    // check that folder before downloading dmg, zip, etc, to save time
// download zip
// open everything else in safari

// can include callbacks
