module.exports = function(grunt) {
  grunt.registerTask('screenshot', 'Create screenshot images', function() {

    var Handlebars = require('handlebars'),
        path = require('path'),
        exec = require('child_process').exec,
        build_dir = './build',
        templates_dir = build_dir + '/templates',
        shot_script = build_dir + '/screenshot.sh',
        dist = grunt.config('staging');

    // read data file
    var data = grunt.file.readJSON(grunt.config('publish.data'));
    data.themes.forEach(function(data) {
      data.theme = 1;
      data.snake_case = ((data.name).toLowerCase()).replace(/ /g, '-');
    });
    data.root_uri = grunt.config(['publish', 'root_uri', 'staging']);

    // Tell grunt this task is asynchronous.
    var done = this.async();
    
    // preview pages for screenshot (only in staging env) and a shell script
    grunt.log.writeln('Creating preview pages for screenshot...');
    var source = grunt.file.read(templates_dir + '/preview.handlebars');
    var template = Handlebars.compile(source);
    var command = ['#/usr/bin/sh'];
    data.themes.forEach(function(theme) {
      var output_dir = dist + '/' + theme.snake_case;
      grunt.file.write(output_dir + '/preview.html', template(theme));
      grunt.log.ok('File "' + output_dir + '/preview.html" created.');
      command.push('webkit2png --scale=1 --clipped --clipwidth=288 --clipheight=183 --dir=' + dist + '/img --filename=' + theme.snake_case + ' ' + data.root_uri + '/' + theme.snake_case + '/preview.html');  
    });
    grunt.file.write(shot_script, command.join("\n"));
    grunt.log.ok('File "' + shot_script + '" created.');
    
    grunt.log.writeln('Creating screenshot images...');

    exec(build_dir + '/screenshot.sh',
      function (error, stdout, stderr) {
        if (error !== null) {
          grunt.log.error('exec error: ' + error);
          done(false);
        } else {
          grunt.log.writeln('Optimizing images...');
          exec('optipng ' + dist + '/img/*.png', function(error, stdout, stderr) {
            if (error !== null) {
              grunt.log.error('exec error: ' + error);
            } else {
              var images = grunt.file.expand(dist + '/img/*.png');
              images.forEach(function(img) {
                var prod = grunt.config('production') + '/img/' + path.basename(img);
                grunt.file.copy(img, prod);
                grunt.log.ok('Copy: "' + img + '" to "' + prod + '"');
              });
              done(true);
            }
          });
        }
    });
  });
  
};
