var gulp         = require('gulp');
var fs           = require('fs');
var devtools     = require('postcss-devtools');
var autoprefixer = require('autoprefixer');
var csswring     = require('csswring');
var mqpacker     = require('css-mqpacker');
var del          = require('del');
var glob         = require('glob');
var $            = require('gulp-load-plugins')();
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;

var json = {};
loadJSON(function(){});

// Register some tasks to expose to the cli
gulp.task('build', gulp.series(
  clean,
  gulp.parallel(
    view,
    gulp.series(styles, themes, themesMin, concatStyles),
    scripts,
    images,
    octicons
  )
));
gulp.task(clean);
gulp.task('watch', gulp.series(
  'build',
  serve
));
gulp.task('default', gulp.series('build'));

// Define tasks using plain functions
function clean() {
  return del(['dist']);
}

function view() {
  return gulp.src('src/**/*.jade')
    .pipe($.jade({
      locals: {
        themes: json.themes
      }
    }))
    .pipe(gulp.dest('dist'));
}

function styles() {
  return gulp.src('src/styles/**/!(_)*.scss')
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
    }))
    .pipe($.sassGlob())
    .pipe($.sass())
    .pipe($.postcss([
      devtools(),
      autoprefixer(),
      mqpacker(),
      csswring()
    ]))
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload({stream: true}));
}

function themes() {
  return gulp.src('src/themes/**/!(_)*.scss')
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
    }))
    .pipe($.sassGlob())
    .pipe($.sass({
      outputStyle: 'expanded'
    }))
    .pipe($.postcss([
      devtools(),
      autoprefixer(),
      mqpacker()
    ]))
    .pipe(gulp.dest('dist/themes'))
    .pipe(reload({stream: true}));
}

function themesMin() {
  return gulp.src('dist/themes/!(*.min).css')
    .pipe($.size({showFiles: true}))
    .pipe($.postcss([
      csswring()
    ]))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/themes'))
}

function concatStyles() {
  return gulp.src('dist/styles/**/*.css')
    .pipe($.concat('styles.css'))
    .pipe(gulp.dest('dist/styles'));
}

function scripts() {
  return gulp.src('src/scripts/**/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts'));
}

function images() {
  return gulp.src('src/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/images'));
}

function octicons() {
  return gulp.src('src/styles/components/octicons/*.{eot,svg,ttf,woff}')
    .pipe(gulp.dest('dist/styles/octicons'));
}

function reloadBrowser() {
  reload();
}

function serve() {
  browserSync({
    server: 'dist'
  });

  gulp.watch('src/styles/**/*.scss', gulp.series(styles, themes, themesMin));
  gulp.watch('src/themes/**/*.scss', gulp.series(styles, themes, themesMin));
  gulp.watch('src/themes.json', gulp.series(loadJSON, view, reloadBrowser));
  gulp.watch('src/**/*.jade', gulp.series(view, reloadBrowser));
  gulp.watch('src/scripts/**/*.js', gulp.series(scripts, reloadBrowser));
  gulp.watch('src/images/**/*', gulp.series(reloadBrowser));
}

function loadJSON(cb) {
  json = {
    themes: JSON.parse(fs.readFileSync('./src/themes.json', 'utf8'))
  };
  cb();
}
