/**
 * Created by USER on 31.10.2015.
 */
var browserify = require("browserify");
var gulp = require("gulp");
var source = require("vinyl-source-stream");
var mochaPhantomJS = require("gulp-mocha-phantomjs");
var mocha = require("gulp-mocha");

gulp.task("browserify", function() {
    return browserify("./public/js/app.js", {debug:true})
        .bundle()
        .pipe(source("app.js"))
        .pipe(gulp.dest("./public/build/"));
});

gulp.task("testClient", function() {
    gulp
        .src("./public/test/test.html")
        .pipe(mochaPhantomJS());
});

gulp.task("testServer", function() {
    gulp
        .src(["./test/support/*.js", "./test/models/*.js", "./test/*.js"], {read: false})
        .pipe(mocha({ul: "bdd"}))
        .once("error", function(err) {
            console.log(err.message);
            process.exit(1);
        })
        .once("end", function() {
            process.exit();
        });
});

gulp.task("default", function() {
    gulp.watch(["./public/js/**"], function(event) {
        gulp.start("browserify");
    })
});