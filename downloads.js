// download software

var Promise = require("bluebird");
var join = Promise.join;
var fs = Promise.promisifyAll(require('fs'));
var path = require('path-extra');

module.exports = function (app) {
  var srcDir = app.backup + '/downloads';
  var tmpDir = srcDir + '/tmp';
  app.log('location:', srcDir).br();

  // make sure there is a tmp dir in srcDir

  fs.readdirAsync(srcDir) // get a list of all files in downloads directory
    .map(function (name) {
      if (app.ignore(name)) return; // ignore now, and we'll remove them later

      var loc = path.join(srcDir, name);
      // check stats on file
      var stat = fs.statAsync(loc).catch(function ignore() { app.warn('Could not stat:', loc); });
      // get contents of file
      var data = fs.readFileAsync(loc, 'utf8').catch(function ignore() { app.warn('Could not read:', loc); });
      // see if file has already been downloaded into tmp
      var tmp = fs.statAsync(path.join(tmpDir, name)).then(function tmp() { return true; }).catch(function tmp() { return false; });

      return join(stat, data, tmp, function (stat, data, tmp) {
        var ext = name.split('.')[1];

        if (ext === 'json')
          data = JSON.parse(data);

        return {
          'name': name,
          'loc': loc,
          'isDirectory': stat.isDirectory(),
          'data': data,
          'ext': ext,
          'alreadyDownloaded': tmp
        };
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
      app.log(file);
      // check if it exists in tmp
      // if dmg, download (and install?)
      // if zip, download (and unzip?)
      // if url, open (and click?)
    });
};
