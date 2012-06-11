module.exports = function(grunt) {
  var path = require('path');
  var config = grunt.config('resources');
  
  grunt.registerTask('resources', 'Copy static files', function() {
    for (var conf in config) {
      var sources = grunt.file.expand(config[conf]['src']);
      sources.forEach(function(src) {
        ['staging', 'production'].forEach(function(env) {
          var dest = grunt.config(env) + '/' + config[conf]['dest'] + '/' + path.basename(src);
          grunt.file.copy(src, dest);
          grunt.log.ok('Copy: "' + src + '" to "' + dest + '"');
        });
      });
    }
  });
};

