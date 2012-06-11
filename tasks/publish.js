module.exports = function(grunt) {

  var Handlebars = require('handlebars'),
      moment = require('moment'),
      exec   = require('child_process').exec,
      path   = require('path'),
      build_dir = './build',
      templates_dir = build_dir + '/templates',
      shot_script = build_dir + '/screenshot.sh';

  // read data file
  var data = grunt.file.readJSON(grunt.config('publish.data'));
  data.themes.forEach(function(data) {
    data.theme = 1;
    data.snake_case = ((data.name).toLowerCase()).replace(/ /g, '-');
  });
  
  // Handlebars helpers
  Handlebars.registerHelper('now', function() {
    return moment().format();
  });
  
  Handlebars.registerHelper('site_name', function() {
    return grunt.config('publish.site_name');
  });
    
  grunt.registerTask('publish', 'Rebuild the pages', function() {
    ['staging', 'production'].forEach(_publish);
  });
  
  grunt.registerTask('screenshot', 'Create screenshot images', function() {
    this.requires('publish');
    // Tell grunt this task is asynchronous.
    var done = this.async();
    grunt.log.writeln('Creating screenshot images...');

    exec(shot_script,
      function (error, stdout, stderr) {
        if (error !== null) {
          grunt.log.error('exec error: ' + error);
          done(false);
        } else {
          grunt.log.writeln('Optimizing images...');
          exec('optipng ' + grunt.config('staging') + '/img/*.png', function(error, stdout, stderr) {
            if (error !== null) {
              grunt.log.error('exec error: ' + error);
            } else {
              var images = grunt.file.expand(grunt.config('staging') + '/img/*png');
              images.forEach(copyFile);
              done(true);
            }
          });
        }
    });
  });
    
  function _publish(env) {
    data.root_uri = grunt.config(['publish', 'root_uri', env]);
    var dist = grunt.config(env);
    grunt.log.writeln('Publishing into ' + dist);
    
    // read layout html
    var source = grunt.file.read(templates_dir + '/layout.handlebars');
     
    // index page
    grunt.log.writeln('Creating index page...');
    var partial = grunt.file.read(templates_dir + '/index.handlebars');
    Handlebars.registerPartial('body', partial);
    var template = Handlebars.compile(source);
    grunt.file.write(dist + '/index.html', template(data));
    grunt.log.ok('File "' + dist + '/index.html" created.');
    
    // theme pages
    grunt.log.writeln('Creating each theme pages...');
    partial = grunt.file.read(templates_dir + '/theme.handlebars');
    Handlebars.registerPartial('body', partial);
    template = Handlebars.compile(source);
    data.themes.forEach(function(theme) {
      var output_dir = dist + '/' + theme.snake_case;
      theme.root_uri = data.root_uri;
      grunt.file.write(output_dir + '/index.html', template(theme));
      grunt.log.ok('File "' + output_dir + '/index.html" created.');
    });
    
    // sitemap.xml
    grunt.log.writeln('Creating a sitemap.xml...');
    source = grunt.file.read(templates_dir + '/sitemap.handlebars');
    template = Handlebars.compile(source);
    grunt.file.write(dist + '/sitemap.xml', template(data));
    grunt.log.ok('File "' + dist + '/sitemap.xml" created.');
    
  }
  
  function copyFile(src) {
    var dest = grunt.config('production') + '/img/' + path.basename(src);
    grunt.file.copy(src, dest);
    grunt.log.ok('Copy: "' + src + '" to "' + dest + '"');
  }
};
