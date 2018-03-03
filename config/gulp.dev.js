const gulp = require('gulp');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const rollup = require('rollup');
const errorHandler = require('./errorHandler.js');

let dirname = null;

function babelProject(){
  return gulp.src(dirname + '/src/**/*.js')
    .pipe(changed(dirname + '/lib', {
      extension: '.js'
    }))
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(babel())
    .pipe(gulp.dest(dirname + '/lib'));
}

function build(){
  // rollup
  const entry = dirname + '/lib/index.js';
  const dest = dirname + '/build/IndexedDB.js';

  return rollup.rollup({
    input: entry
  }).then((bundle)=>{
    bundle.write({
      format: 'umd',
      name: 'IndexedDB',
      file: dest
    });
  });
}

function watch(){
  gulp.watch(dirname + '/src/**/*.js', gulp.series(babelProject, build));
}

module.exports = function(dir){
  dirname = dir;
  gulp.task('default', gulp.series(babelProject, watch));
};