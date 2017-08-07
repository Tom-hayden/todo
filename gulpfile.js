/*eslint-env node*/
var gulp = require("gulp");
var eslint = require("gulp-eslint");
var mocha = require("gulp-mocha");
var istanbul = require("gulp-istanbul");

gulp.task("lint", function () {
    return gulp.src(["gulpfile.js", "server.js", "server/**/*.js", "test/**/*.js", "public/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("test:mocha", function () {
    return gulp.src("test/**/*.js", { read: false })
        .pipe(mocha({
            reporter: "spec",
        }));
});

gulp.task("test:istanbul:pre", function () {
    return gulp.src("server/**/*.js")
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task("test:istanbul", ["test:istanbul:pre"], function () {
    return gulp.src("test/**/*.js")
        .pipe(mocha({ reporter: "spec" }))
        .pipe(istanbul.writeReports({
            dir: "./build_artifacts",
            reporters: ["lcov", "text", "text-summary"],
            reportOpts: { dir: "./build_artifacts" }
        }))
        .pipe(istanbul.enforceThresholds({ thresholds: { each: 95 } }));
});

gulp.task("test", ["lint", "test:istanbul"])
gulp.task("default", ["test"]);
