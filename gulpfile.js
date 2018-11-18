'use strict';
const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    runSequence = require("run-sequence"),
    plugins = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*', '*', '!typescript'],
        replaceString: /\bgulp[\-.]/,
        camelize: true
    });
const path = {
    src: "./src",
    img: "./src/img/**/*.*",
    sass: "./src/sass/**/*.scss",
    font: "./src/fonts/**/*.*",
    js: "./src/js/**/*.js",
    video: "./src/video/*.*",
    dist: "./dist"
};

gulp.task('copy', () =>
    gulp.src([path.video], {
        src: "./src"
    })
        .pipe(gulp.dest(path.dist))
);
gulp.task('html', () =>
    gulp.src(path.src + '/**/*.html')
        .pipe(gulp.dest(path.dist))
);
gulp.task('jsmin', () =>
    gulp.src(path.js)
        .pipe(plugins.uglifyes({
            mangle: true,
            ecma: 6
        }))
        .pipe(plugins.rename({
            suffix: "-min"
        }))
        .pipe(gulp.dest(path.dist + "/js"))
);
gulp.task('imgmin', () =>
    gulp.src(path.img)
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(path.dist + "/img"))
);
gulp.task('fontmin', () =>
    gulp.src(path.font, {
        src: "./src"
    })
        .pipe(plugins.fontmin())
        .pipe(gulp.dest(path.dist + "/fonts"))
);
gulp.task('sass', () => {
    return gulp.src(path.sass)
        .pipe(plugins.concat("style.scss"))
        .pipe(plugins.plumber())
        .pipe(plugins.sass({
            outputStyle: 'compressed'
        }))
        .pipe(plugins.autoprefixer({
            browsers: ["last 100 versions"]
        }))
        .pipe(plugins.cleanCss({
            level: 2
        }))
        .pipe(plugins.rename({
            suffix: "-min"
        }))
        .pipe(gulp.dest(path.dist + '/css'))
        .pipe(browserSync.stream());
});

gulp.task("copy", () => {
    gulp.src("./src/video/*.*", {
        base: "./src/"
    })
        .pipe(gulp.dest(path.dist));
})

gulp.task("server", () => {
    browserSync.init({
        server: "./dist"
    });
});
gulp.task("watch", () => {
    gulp.watch("./src/**/*.html", ['html', browserSync.reload]);
    gulp.watch(path.js, ['jsmin', browserSync.reload]);
    gulp.watch(path.sass, ["sass"]);
});

gulp.task("build", () => {
    runSequence("sass", "jsmin", "html", "imgmin", "fontmin", "copy")
});
gulp.task("default", () => {
    runSequence("sass", "jsmin", "html", "imgmin", "fontmin", "copy", "watch", "server")
});