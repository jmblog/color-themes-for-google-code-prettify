var rimraf = require('rimraf'),
    mkdirp = require('mkdirp');
    _ = require('underscore');

module.exports = function(grunt) {
  grunt.registerTask('clean', 'Wipe the previous build dirs', function() {
    var sources = _.flatten([grunt.file.expand(grunt.config('staging') + '/*'), grunt.file.expand(grunt.config('production') + '/*')]);
    sources.forEach(grunt.task._helpers.rimraf);
  });

  grunt.registerTask('mkdirs', 'Prepares the build dirs', function() {
    var dirs = [grunt.config('staging'), grunt.config('production')];
    dirs.forEach(grunt.task._helpers.mkdir);
  });
  //
  // **rimraf** is the helper wrapper for
  // [rimraf](https://github.com/isaacs/rimraf#readme) package. The
  // given `cb` callback if passed in will make the call asynchronous,
  // otherwise `rimraf.sync` is used.
  //
  grunt.registerHelper('rimraf', function(dir, cb) {
    grunt.log.writeln('rm -rf "' + dir + '"');
    if(typeof cb !== 'function') { return rimraf.sync(dir); }
    rimraf(dir, cb);
  });

  //
  // **mkdir** helper is basic wrapper around
  // [node-mkdirp](https://github.com/substack/node-mkdirp#readme).
  // Takes a `directory` path to create, process is async if a valid
  // callback function is passed in.
  //
  grunt.registerHelper('mkdir', function(dir, cb) {
    if(typeof cb !== 'function') { return mkdirp.sync(dir); }
    mkdirp(dir, cb);
  });
};
