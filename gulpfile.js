const gulp = require('gulp');
const typescript = require('gulp-typescript');
const { rollup } = require('rollup');
const { terser } = require('rollup-plugin-terser');
const tsconfig = require('./tsconfig.json');

/* lib */
function proLibProject() {
  const result = gulp.src('src/**/*.ts')
    .pipe(typescript(tsconfig.compilerOptions));

  return result.js.pipe(gulp.dest('lib'));
}

/* build */
function createProBuildProject(compression) {
  return async function proBuildProject() {
    const bundle = await rollup({
      input: 'lib/index.js',
      plugins: compression ? [terser()] : undefined
    });

    await bundle.write({
      format: 'umd',
      name: 'IndexedDB',
      file: `build/IndexedDB-tools${ compression ? '.min' : '' }.js`
    });
  };
}

exports.default = gulp.series(
  proLibProject,
  gulp.parallel(createProBuildProject(true), createProBuildProject(false))
);