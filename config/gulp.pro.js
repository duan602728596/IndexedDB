const gulp = require('gulp');
const babel = require('gulp-babel');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify').uglify;

let dirname = null;

function babelProject(){
  return gulp.src(dirname + '/src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest(dirname + '/lib'));
}

function build(){
  // rollup
  const entry = dirname + '/lib/index.js';
  const dest = dirname + '/build/IndexedDB-tools.js';

  return rollup.rollup({
    input: entry,
    plugins: [
      uglify()
    ]
  }).then((bundle)=>{
    bundle.write({
      format: 'umd',
      name: 'IndexedDB',
      file: dest
    });
  });
}

module.exports = function(dir){
  dirname = dir;
  gulp.task('default',  gulp.series(babelProject, build));
};