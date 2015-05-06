# bkup

Scripts to setup your fresh os install, from backup.
Dotfiles and downloads stored in a separate directory/project (defaults to ~/.backup/)

## install

### node.js

Make sure you have node.js installed

	node --version

If not, get it <https://nodejs.org/download/>

### node module from npm

If you have **sudo** permissions, you can install globally (where npm installs):

	npm install -g bkup

Or if you already have a location you like to install your **node_modules** (or you're not **sudo**), then **cd** over to it and:

	npm install bkup

