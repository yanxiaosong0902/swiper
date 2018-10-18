var gulp = require( 'gulp' )
var sass = require( 'gulp-sass' )
var browserSync = require( 'browser-sync' )
var useref = require( 'gulp-useref' )
var uglify = require( 'gulp-uglify' )
var gulpIf = require( 'gulp-if' )
var minifyCss = require( 'gulp-minify-css' )
var imageMin = require( 'gulp-imagemin' )
var cache = require( 'gulp-cache' )
var del = require( 'del' )
var runSequence = require( 'run-sequence' )
var babel = require( 'gulp-babel' )
gulp.task( 'sass', function() {
  return gulp.src( 'app/scss/*.scss' )
    .pipe( sass() )
    .pipe( gulp.dest( 'app/css' ) )
    .pipe( browserSync.reload( {
      stream: true
    } ) )
} )
gulp.task( 'browserSync', function() {
  browserSync( {
    server: {
      baseDir: 'app'
    },
    notify: false
  } )
} )
gulp.task( 'babel', function() {
  return gulp.src( 'app/*.js' )
    .pipe( babel( {
      presets: [ 'env' ]
    } ) )
    .pipe( gulp.dest( 'dist' ) )
} )
gulp.task( 'useref', function() {
  return gulp.src( 'app/*.html' )
    .pipe( gulpIf( '*.css', minifyCss() ) )
    .pipe( gulpIf( '*.js', uglify() ) )
    .pipe( useref() )
    .pipe( gulp.dest( 'dist' ) )
} )
gulp.task( 'images', function() {
  return gulp.src( 'app/images/**/*.+(png|jpg|gif|svg)' )
    .pipe( cache( imageMin( {
      interlaced: true
    } ) ) )
    .pipe( gulp.dest( 'dist/images' ) )
} )
gulp.task( 'clean', function( callback ) {
  del( 'dist' )
  return cache.clearAll( callback )
} )
gulp.task( 'clean:dist', function() {
  return del( [ 'dist/**/*', '!dist/img/**/*', '!dist/img' ] )
} )
gulp.task( 'watch', [ 'browserSync', 'sass' ], function() {
  gulp.watch( 'app/scss/*.scss', [ 'sass' ] )
  gulp.watch( 'app/*.html', browserSync.reload )
  gulp.watch( 'app/js/*.js', browserSync.reload )
} )
gulp.task( 'build', function( callback ) {
  runSequence( 'clean:dist', [ 'sass', 'babel', 'useref', 'images' ], callback )
} )
gulp.task( 'default', function( callback ) {
  runSequence( [ 'sass', 'browserSync', 'watch' ], callback )
} )
