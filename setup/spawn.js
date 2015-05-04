// util to run command line processes, provide feedback in the console, and return useful output
var childSpawn = require('child_process').spawnSync;
// although exec accepts a string (spawn takes separate args for command, options, etc)
// we use spawn because it returns more useful info than exec

// accepts a string to be run on the command line
module.exports = function (cmd, silent) {
  // log the command we're running, unless running silently to collect info
  if (!silent)
    console.log('$', cmd);

  // splicing the command out of the string to match the spawn api
  var args = cmd.split(' ');
  var response = childSpawn(args.splice(0,1), args);

  var output;
  var set = function (buf) {
    if (buf) {
      output = buf.toString('utf8'); // convert buffer to string and set to output

      if (!silent)
        console.log('>', output);
    }
  };

  // run for both, but error last, so we highlight any errors (although we log both)
  set(response.stdout);
  set(response.error);

  // if output was not set, send back a 
  return output || 'no stdout or error';
};
