// check if git is installed
// if not, open install page in browser
// TODO: prompt to update to current version

module.exports = function install(app) {
  app.title('GIT');

  var check = app.spawn('git --version'); // run command to check for git

  if (check.match(/^git version/)){
    app.msg('You\'ve got git');
  } else {
    app.msg('You gotta get git');
    app.spawn('open http://git-scm.com/downloads'); // opens in browser
  }

  // ask for github username (add to .bash_profile)
  // so i can do "git push" to push my current branch
  // git config --global push.default simple

  // set email, etc (add to .bash_profile)

  // npm install nodemon or something similar

  /*
    var completion = new File('git-completion.sh');
    completion.curl('https://raw.github.com/git/git/master/contrib/completion/git-completion.bash');

    var gprompt = new File('git-prompt.sh');
    gprompt.curl('https://raw.github.com/git/git/master/contrib/completion/git-prompt.sh');
  */
};
