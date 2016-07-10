var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var spawn = require('child_process').spawn;

var sassSrc = '_sass/main.scss';
var scssSrc = '_sass/*.scss';
var cssDest = 'css';
var cssSourceDest = '_site/css';
var jekyllSrc = ['*.html', '*/*.html', '*/*.md', '!_site/**', '!_site/*/**', 'javascripts/*.js'];

gulp.task('sass', function() {
  return sass(sassSrc, {sourcemap: true})
  .on('error', function(error) {
    console.log('Error!', error.message);
  })
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(cssDest))
  .pipe(gulp.dest(cssSourceDest));
});

gulp.task('jekyll', function() {
  var jekyll = spawn('jekyll', ['build']);

  jekyll.on('exit', function (code) {
    console.log('-- Finished Jekyll Build --');
  });
});

gulp.task('serve', function() {
  var jekyll = spawn('jekyll', ['serve', '--no-watch']);

  jekyll.on('exit', function (code) {
    console.log('-- Finished Jekyll Serve with code: ' + code + ' --');
  });
});

gulp.task('watch', function() {
  gulp.watch(scssSrc, ['sass']);
  gulp.watch(jekyllSrc, ['jekyll', 'serve']);
});

gulp.task('default', ['sass', 'jekyll', 'serve', 'watch']);

