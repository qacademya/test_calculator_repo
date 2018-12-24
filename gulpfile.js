'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var uglify = require('gulp-uglify');
var pump = require('pump');

var del = require('del');
var rename = require('gulp-rename');
var server = require('browser-sync').create();

gulp.task('html', function () {
  return gulp.src('./source/*.html')
		.pipe(gulp.dest('build'))
});

gulp.task('sass', function () {
	return gulp.src('source/sass/style.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('build/css'))
		.pipe(server.stream());
});

gulp.task('js', function (cb) {
  pump([
        gulp.src('source/js/*.js'),
        uglify(),
        rename(function (path) {
          path.basename += '.min';
        }),
        gulp.dest('build/js')
    ],
    cb
  );
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('sass'));
	gulp.watch('source/*.html', gulp.series('html', 'refresh'));
	gulp.watch('source/js/*.js', gulp.series('js'));
});

gulp.task('build', gulp.series('clean', 'html', 'sass', 'js'));

gulp.task('start', gulp.series('build', 'server'));