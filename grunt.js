/*global module:false*/
module.exports = function(grunt) {
  
  var staging = './intermediate';
  var production = './publish';

  // Project configuration.
  grunt.initConfig({
    
    staging: staging,
    
    production: production,
    
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'build/assets/js/script.js']
    },
    
    min: {
      staging: {
        src: ['build/assets/js/script.js'],
        dest: staging + '/js/script.min.js'
      },
      production: {
        src: ['build/assets/js/script.js'],
        dest: production + '/js/script.min.js'
      }
    },
    
    less: {
      staging: {
        src: 'build/assets/less/style.less',
        dest: staging + '/css/style.css',
        options: {
          compress: false
        }
      },
      production: {
        src: 'build/assets/less/style.less',
        dest: production + '/css/style.css',
        options: {
          compress: true
        }
      }
    },
    
    publish: {
      site_name: 'Color themes for Google Code Prettify',
      data: 'build/data.json',
      root_uri: {
        staging: 'http://prettify.local:8000',
        production: 'http://jmblog.github.com/color-themes-for-google-code-prettify'
      }
    },
    
    screenshot: {},
    
    resources: {
      font: {
        src: 'build/assets/font/*.*',
        dest: 'font'
      },
      js: {
        src: 'build/assets/js/*.js',
        dest: 'js'
      },
      css: {
        src: 'build/assets/css/themes/*.css',
        dest: 'css/themes'
      },
      img: {
        src: 'build/assets/img/*.*',
        dest: 'img'
      },
      statics: {
        src: 'build/statics/*.*',
        dest: '.'
      }
    },
    
    watch: {
      assets: {
        files: ['<config:lint.files>', 'build/assets/less/**/*.less'],
        tasks: 'lint min less resources'
      },
      templates: {
        files: 'build/templates/*.handlebars',
        tasks: 'publish'
      }
    },
    
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        loopfunc: true
      },
      globals: {
        jQuery: true,
        require: true,
        __dirname: true,
        module: true
      }
    },
    
    uglify: {}
  
  });
  
  // Plugin tasks
  grunt.loadNpmTasks('grunt-less');
  grunt.loadTasks('tasks');
  
  // Default task.
  grunt.registerTask('default', 'lint clean min less publish resources screenshot');

};
