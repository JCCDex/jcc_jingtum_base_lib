// gulp jingtum base lib to front enabled js lib
'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var webpack = require('webpack');
var rename = require('gulp-rename');

var pkg = require('./package.json');

gulp.task('eslint', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', function (callback) {
    webpack({
        cache: true,
        entry: './index.js',
        output: {
            library: 'jingtum_base',
            path: './dist',
            filename: ['jingtum-base-', '.js'].join(pkg.version)
        },
    }, callback);
});

gulp.task('build-min', ['build'], function (callback) {
    var file = ['./dist/jingtum-base-', '.js'].join(pkg.version);
    return gulp.src(file)
        .pipe(uglify())
        .pipe(rename(['jingtum-base', '-min.js'].join(pkg.version)))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-debug', function (callback) {
    webpack({
        cache: true,
        entry: './index.js',
        output: {
            library: 'jingtum_base',
            path: './dist',
            filename: ['jingtum-base-', '-debug.js'].join(pkg.version)
        },
        debug: true,
        devtool: 'eval'
    }, callback);
});

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js'], ['eslint']);
})

gulp.task('default', ['lint', 'build', 'build-debug', 'build-min']);
gulp.task('dev', ['watch', 'eslint'])