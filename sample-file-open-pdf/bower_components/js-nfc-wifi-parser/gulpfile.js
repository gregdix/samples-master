var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['copy', 'compress']);

gulp.task('copy', function (callback) {
  pump([
      gulp.src('src/**/*.js'),
      gulp.dest('dist')
    ],
    callback
  );
});

gulp.task('compress', function (callback) {
  pump([
      gulp.src('src/**/*.js'),
      sourcemaps.init(),
      uglify(),
      rename({suffix: '.min'}),
      sourcemaps.write('dist'),
      gulp.dest('dist')
    ],
    callback
  );
});