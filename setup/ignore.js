// list of standard filenames that scripts should ignore

module.exports = function (name) {
  var list = ['README.md', '.git', '.gitignore', 'tmp', 'node_modules'];

  return list.indexOf(name) !== -1;
};
