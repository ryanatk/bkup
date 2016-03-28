// download software

var Promise = require("bluebird");
var join = Promise.join;
var fs = Promise.promisifyAll(require('fs'));
var path = require('path-extra');

module.exports = function (app) {
  return function () {
    // get the list of downloads
    var srcDir = path.join(app.rc.data.bkupLoc, 'downloads');
    var tgtDir = path.join(srcDir, 'tmp');
    // TODO: download to ~/Downloads (or path.join(srcDir, 'tmp'), prompt to add to .gitignore)

    fs.readdirAsync(srcDir) // get a list of all files in downloads directory
      .map(function (name) {
        if (app.ignore(name)) return; // ignore now, and we'll remove them later

        var loc = path.join(srcDir, name);

        return new app.file({
          'name': name,
          'loc': loc,
          'ext': name.split('.')[1] || '' // file extension (json or js)
        });
      })
      .then(function (files) {
        // remove anything in the ignore list
        files.forEach(function (file, i) {
          if (!file) { // because we ignored during map, these are undefined
            files.splice(i, 1);
          }
        });
        return files;
      })
      .each(function (file) {
        // require js files and run
        if (file.ext === 'js')
          app.exec('open -a Terminal "' + file.loc + '"');

        // read json files and dowload from url
        if (file.ext === 'json') {
          fs.readFileAsync(file.loc, 'utf8')
            .then(function (data) {
              return JSON.parse(data); // parse JSON from the file data
            })
            .then(function (data) {
              // TODO: check tmp before downloading
              // TODO: check Applications folder before downloading (not sure if this will work unless i make sure names match)
              // TODO: prompt for interactive or download all

              var url = data.dmg || data.zip || data.link;
              app.exec('open ' + url);
            });
        }
      });
  };
};
