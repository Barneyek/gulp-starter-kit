var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var prefix = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var del = require('del');
var sequence = require('run-sequence');

var config = {
   dist: 'dist/',
   app: 'app/',
   cssin: 'app/css/**/*.css',
   jsin: 'app/js/**/*.js',
   imgin: 'app/img/*.{jpg,jpeg,png,gif}',
   scssin: 'app/scss/**/*.scss',
   htmlin: 'app/*.html',
   cssout: 'dist/css',
   jsout: 'dist/js',
   imgout: 'dist/img',
   scssout: 'app/css',
   cssoutname: 'styles.css',
   jsoutname: 'main.js'
}

function errorLog(error) {
   console.error(error.message);
}

gulp.task('serve', ['sass'], function () {

   browserSync.init({
      server: config.app
   });

   gulp.watch(config.scssin, ['sass']);
   gulp.watch(config.htmlin).on('change', browserSync.reload);
});

gulp.task('sass', function () {
   return gulp.src(config.scssin)
      .pipe(sourcemaps.init())
      .pipe(sass({
         style: 'expanded'
      }))
      .on('error', errorLog)
      .pipe(prefix('last 2 versions'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.scssout))
      .pipe(browserSync.stream());
});

gulp.task('image', function () {
   gulp.src(config.imgin)
      .pipe(imagemin())
      .pipe(gulp.dest(config.imgout));
});

gulp.task('scripts', function () {
   return gulp.src(config.jsin)
      .pipe(concat('main.js'))
      .on('error', errorLog)
      .pipe(uglify())
      .pipe(gulp.dest(config.jsout));
});

gulp.task('css', function () {
   return gulp.src(config.cssin)
      .pipe(concat('styles.css'))
      .pipe(cleanCSS())
      .pipe(gulp.dest(config.cssout));
});

gulp.task('clean', function () {
   return del(['dist']);
});

gulp.task('build', function () {
   sequence('clean', ['scripts', 'image', 'css']);
});

gulp.task('default', ['serve']);
