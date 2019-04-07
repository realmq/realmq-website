const {writeFileSync} = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-css-url');
const tildeImporter = require('node-sass-tilde-importer');

const paths = {
  styles: {
    src: [
      'src/scss/**/*.scss',
      'node_modules/swagger-ui-dist/swagger-ui.css'
    ],
    dest: 'static/css',
  },
  images: {
    src: 'src/img/**/*',
    dest: 'static/img',
  },
  fonts: {
    src: [
      'node_modules/et-line/fonts/**/*',
      'node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/**/*'
    ],
    dest: 'static/fonts',
  },
  scripts: {
    src: [
      'node_modules/swagger-ui-dist/swagger-ui-bundle.*',
      'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.*',
    ],
    dest: 'static/js'
  },
  watch: {
    src: 'src/**/*'
  }
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

const copyScripts = () => gulp
  .src(paths.scripts.src)
  .pipe(gulp.dest(paths.scripts.dest));

const clean = () => del([paths.styles.dest, paths.images.dest, paths.scripts.dest]);

const revision = () => gulp
  .src([
    'static/**/*.*',
    `!static/**/*-${'[0-9a-f]'.repeat(10)}.*`,
    '!static/__build-time'
  ])
    .pipe(rev())
    .pipe(revReplace())
    .pipe(gulp.dest('static'))
    .pipe(rev.manifest('assets.json'))
    .pipe(gulp.dest('data'));

const watch = () => gulp.watch(
  paths.watch.src,
  { ignoreInitial: false },
  build
).on('error', () => {});

gulp.task('revision', revision);
gulp.task('scss', buildStyles);
gulp.task('images', copyImages);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
gulp.task('clean', clean);

gulp.task('write-build-time', function (cb) {
  // wait one sec to give hugo some time to react on changes.
  setTimeout(() => {
    writeFileSync('./static/__build-time', (new Date).toISOString());

    cb();
  }, 500);
});

const build = gulp.series('clean', gulp.parallel('scss', 'images', 'fonts', 'scripts'), 'revision', 'write-build-time');

gulp.task('build', build);
gulp.task('default', build);
gulp.task('watch', watch);
