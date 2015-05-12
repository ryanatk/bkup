// download software

var Promise = require("bluebird");
var join = Promise.join;
var fs = Promise.promisifyAll(require('fs'));
var path = require('path-extra');

module.exports = function (app) {
  // get the list of downloads
  var srcDir = path.join(app.user.bkup, 'downloads');
  var tgtDir = path.join(srcDir, 'tmp');
  // TODO: download to ~/Downloads (or path.join(srcDir, 'tmp'), prompt to add to .gitignore)
  app.log('location:', srcDir).br();

  fs.readdirAsync(srcDir) // get a list of all files in downloads directory
    .map(function (name) {
      if (app.ignore(name)) return; // ignore now, and we'll remove them later

      var loc = path.join(srcDir, name);
      // get stats of file
      var stat = fs.statAsync(loc).catch(function ignore() { app.warn('Could not stat:', loc); });
      // see if file has already been downloaded into tmp
      var tmp = fs.statAsync(path.join(tgtDir, name)).then(function tmp() { return true; }).catch(function tmp() { return false; });

      return join(stat, tmp, function (stat, tmp) {
        return new app.file({
          'name': name,
          'loc': loc,
          'isDirectory': stat.isDirectory(),
          'ext': name.split('.')[1] || '', // file extension (json or js)
          'isDownloaded': tmp // check if it exists in tmp
        });
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
        app.exec('open -a Terminal "`' + file.loc + '`"');

      // read json files and dowload from url
      if (file.ext === 'json') {
        fs.readFileAsync(file.loc, 'utf8').then(function (data) {
          return JSON.parse(data); // parse JSON from the file data
        }).then(function (data) {
          // TODO: check tmp before downloading
          // TODO: check Applications folder before downloading (not sure if this will work unless i make sure names match)
          // TODO: prompt for interactive or download all

          var url = data.dmg || data.zip || data.link;
          app.exec('open ' + url);

          /*
          if (data.dmg) { // if dmg, download
            file.download(data.dmg, path.join(tgtDir, data.name + '.dmg'));
          }
          else if (data.zip) { // if zip, download
            file.download(data.zip, path.join(tgtDir, data.name + '.zip'));
          }
          else if (data.link) { // if url, open in a browser
            app.spawn('open ' + data.link);
          } else { // if no good url was found
            app.warn('Your download does not include a proper url:', file.name);
          }
          */
        });
      }
    });
};
