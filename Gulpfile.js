"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");

gulp.task("default", ["js", "watch.js"]);

gulp.task("watch.js", function () {
    return gulp.watch("./client/js/**/*.js", ["js"])
});

gulp.task("js", function () {
    return gulp.src("./client/js/**/*.js")
        .pipe(concat("concat.js"))
        .pipe(gulp.dest("./public/js"))
});