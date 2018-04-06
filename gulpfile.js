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
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'static/fonts',
  },
};

const buildStyles = () => gulp
  .src(paths.styles.src)
  .pipe(sass({ outputStyle : 'compressed', importer: tildeImporter }))
  .pipe(gulp.dest(paths.styles.dest));

const copyImages = () => gulp
  .src(paths.images.src)
  .pipe(gulp.dest(paths.images.dest));

const copyFonts = () => gulp
  .src(paths.fonts.src)
  .pipe(gulp.dest(paths.fonts.dest));

const clean = () => del([paths.styles.dest, paths.images.dest]);

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

const watch = () => gulp.watch(
  [
    paths.styles.src,
    paths.images.src,
    paths.fonts.src,
  ],
  { ignoreInitial: false },
  build
).on('error', () => {});



gulp.task('revision', revision);
gulp.task('scss', buildStyles);
gulp.task('images', copyImages);
gulp.task('fonts', copyFonts);
gulp.task('clean', clean);

const build = gulp.series('clean', gulp.parallel('scss', 'images', 'fonts'), 'revision');

gulp.task('build', build);
gulp.task('default', build);
gulp.task('watch', watch);
