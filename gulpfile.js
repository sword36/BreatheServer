/**
 * Created by USER on 31.10.2015.
 */
var browserify = require("browserify");
var gulp = require("gulp");
var source = require("vinyl-source-stream");
var mochaPhantomJS = require("gulp-mocha-phantomjs");
//var watch = require("gulp-watch");

gulp.task("browserify", function() {
    return browserify("./public/js/app.js", {debug:true})
        .bundle()
        .pipe(source("app.js"))
        .pipe(gulp.dest("./public/js/build/"));
});

gulp.task("testClient", function() {
    gulp
        .src("./public/test/test.html")
        .pipe(mochaPhantomJS());
});

gulp.task("default", function() {
    gulp.watch("./public/js/**", function(event) {
        gulp.start("browserify");
    })
});