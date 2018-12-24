'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

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
});

gulp.task('build', gulp.series('clean', 'html', 'sass'));

gulp.task('start', gulp.series('build', 'server'));