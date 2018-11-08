const path = require('path');
const gulp = require('gulp');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const { rollup } = require('rollup');
const errorHandler = require('./errorHandler.js');
const babelConfig = require('./babelConfig');

let dirname = null;
let js = null;
let lib = null;
let entry = null;
let dist = null;

/* 编译es6 */
function babelProject(){
  return gulp.src(js)
    .pipe(changed(lib, {
      extension: '.js'
    }))
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(lib));
}

gulp.task('babelProject', babelProject);

/* 打包代码 */
async function build(){
  const bundle = await rollup({
    input: entry
  });

  return await bundle.write({
    format: 'umd',
    name: 'IndexedDB',
    file: dist
  });
}

gulp.task('build', ['babelProject'], build);

function watch(){
  gulp.watch(js, ['build']);
}

module.exports = function(dir){
  dirname = dir;
  js = path.join(dirname, 'src/**/*.js');
  lib = path.join(dirname, 'lib');
  entry = path.join(lib, 'index.js');
  dist = path.join(dirname, 'build/IndexedDB-tools.js');

  gulp.task('default',  ['build'], function(){
    watch();
  });
};