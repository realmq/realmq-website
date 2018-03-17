const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-css-url');
const tildeImporter = require('node-sass-tilde-importer');

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'static/css',
  },
  images: {
    src: 'src/img/**/*',
    dest: 'static/img',
  },
};

const buildStyles = () => gulp
  .src(paths.styles.src)
  .pipe(sass({ outputStyle : "compressed", importer: tildeImporter }))
  .pipe(gulp.dest(paths.styles.dest));

const copyImages = () => gulp
  .src(paths.images.src)
  .pipe(gulp.dest(paths.images.dest));

const clean = () => del([paths.styles.dest, paths.images.dest]);

const build = ['clean', 'scss', 'images'];

const watch = () => {
  gulp.watch(paths.styles.src, buildStyles);
  gulp.watch(paths.images.src, copyImages);
};

const revision = () => gulp
  .src([
    'static/**/*.*',
    `!static/**/*-${'[0-9a-f]'.repeat(10)}.*`,
  ])
    .pipe(rev())
    .pipe(revReplace())
    .pipe(gulp.dest('static'))
    .pipe(rev.manifest('assets.json'))
    .pipe(gulp.dest('data'));

gulp.task('scss', buildStyles);
gulp.task('images', copyImages);
gulp.task('watch', ['scss', 'images'], watch);
gulp.task('clean', clean);
gulp.task('build', build, revision);
gulp.task('default', build, revision);
