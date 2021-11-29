const gulp = require("gulp")
const sass = require("gulp-sass")(require('sass'))
const autoprefixer = require("gulp-autoprefixer")
const image = require('gulp-image')
const babel = require('gulp-babel')
const terser = require("gulp-terser")
const concat = require("gulp-concat")
const sourcemaps = require("gulp-sourcemaps")
const browserSync = require("browser-sync").create()

const path = {
    js: {
        sour: 'src/js/*.js',
        dest: 'dist/js/'
    },
    css: {
        sour: 'src/scss/*.scss',
        dest: 'dist/css/'
    },
    html: {
        sour: 'src/*.html',
        dest: 'dist'
    },
    img: {
        sour: 'src/img/*',
        dest: 'dist/img/'
    },
    ico: {
        sour: 'src/favicon.ico',
        dest: 'dist'
    }
}

gulp.task('babel', () => {
    return gulp.src(path.js.sour)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-modules'],
            plugins: ['@babel/transform-runtime'],
        }))
        .pipe(terser())
        // .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.js.dest))
        .pipe(browserSync.stream({match: path.js.dest}))
})

//sass mode-compact|compressed|nested|expended
gulp.task('sass', () => {
    return gulp.src(path.css.sour)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.css.dest))
        .pipe(browserSync.stream({match: path.css.dest}))
})

gulp.task('image', () => {
    return gulp.src(path.img.sour)
        .pipe(image())
        .pipe(gulp.dest(path.img.dest))
})

gulp.task('copy-html', () => {
    return gulp.src(path.html.sour)
        .pipe(gulp.dest(path.html.dest))
})

gulp.task('copy-jsb', () => {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.js')
        .pipe(gulp.dest(path.js.dest))
})

gulp.task('copy-mapb', () => {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.js.map')
        .pipe(gulp.dest(path.js.dest))
})

gulp.task('copy-jq', () => {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(path.js.dest))
})

gulp.task('copy-mapjq', () => {
    return gulp.src('node_modules/jquery/dist/jquery.min.map')
        .pipe(gulp.dest(path.js.dest))
})

gulp.task('copy-json', () => {
    return gulp.src('json/*.json')
        .pipe(gulp.dest('dist/json/'))
})

gulp.task('copy-favicon', () => {
    return gulp.src(path.ico.sour)
        .pipe(gulp.dest(path.ico.dest))
})

gulp.task('serve', function () {
    browserSync.init({
        server: './dist/'
    })
    gulp.watch(path.img.sour, gulp.parallel('image'))
    gulp.watch(path.css.sour, gulp.parallel('sass'))
    gulp.watch(path.js.sour, gulp.parallel('babel'))
    gulp.watch(path.html.sour, gulp.parallel('copy-html'))
    gulp.watch(path.html.dest).on('change', browserSync.reload);
})

gulp.task('default', gulp.series('serve'))
