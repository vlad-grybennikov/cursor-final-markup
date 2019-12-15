/* PROJECT STRUCTURE
src/
    js/
    lib/
    scss/
    img/
    index.html
 dist/
 gulpfile.js
*/
const gulp = require("gulp"); // загрузить локальный галп === подключить библиотеку
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const concat = require("gulp-concat");
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const zip = require('gulp-zip');

gulp.task("html", (done) => {
    // загрузить файл в память
    // выгрузить его в другую директорию
    return gulp.src("./src/*.html")
        .pipe(gulp.dest("./dist")) // только путь, но не название
        .pipe(browserSync.stream());
});

gulp.task("fonts", (done) => {
    // загрузить файл в память
    // выгрузить его в другую директорию
    return gulp.src("./src/fonts.*")
        .pipe(gulp.dest("./dist/fonts/")) // только путь, но не название
        .pipe(browserSync.stream());
});

gulp.task("images", (done) => {
    return gulp.src("./src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("./dist/img"));
})

gulp.task("scss", (done) => {
    return gulp.src("./src/scss/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("js", (done) => {
    return gulp.src("./src/js/**/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('index.js'))
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
});

gulp.task("browser-init", (done) => {
    return browserSync.init({
        server: "./dist"
    });
})

gulp.task("watch", (done) => {
    gulp.watch("./src/*.html", gulp.series("html"));
    gulp.watch("./src/fonts/*", gulp.series("fonts"));
    gulp.watch("./src/scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./src/js/**/*.js", gulp.series("js"));
    gulp.watch("./src/img/**/*", gulp.series("images"));
    return;
});

gulp.task("deploy", (done) => {
    return gulp.src("./dist/**/*")
        .pipe(zip('deploy.zip'))
        .pipe(gulp.dest("./"))
        .pipe(done());
})

gulp.task("default", gulp.series("html", "scss", "fonts", "js", "images", "browser-init", "watch"));

// watcher
// browserSync