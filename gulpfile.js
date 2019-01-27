'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pump = require('pump');

var del = require('del');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');
var server = require('browser-sync').create();

gulp.task('html', function () {
  return gulp.src('./source/*.html')
		.pipe(gulp.dest('build'));
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
    gulp.src(['source/js/data.js', 'source/js/utils.js', 'source/js/math.js', 'source/js/calculation.js', 'source/js/main.js'])
    .pipe(concat('main.js')),
    gulp.dest('build/js'),
    uglify(),
    rename(function (path) {
      path.basename += '.min';
    }),
    gulp.dest('build/js')
  ],
  cb
  );
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('images', function () {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('source/img'));
});

gulp.task('sprite', function () {
  return gulp.src(['source/img/*-icon.svg'])
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
});

gulp.task('copysvg', function () {
  return gulp.src([
    'source/img/*.svg'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
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
  gulp.watch('source/img/*.svg', gulp.series('copysvg', 'sprite', 'html', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/js/*.js', gulp.series('js'));
});

gulp.task('build', gulp.series('clean', 'copy', 'sass', 'js', 'sprite', 'html'));

gulp.task('start', gulp.series('build', 'server'));
