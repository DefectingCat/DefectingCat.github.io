const { series, parallel } = require('gulp');
const { src, dest } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const htmlclean = require('gulp-htmlclean');

function html() {
  return src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      })
    )
    .pipe(dest('./public'));
}

function css() {
  return src('./public/**/*.css').pipe(cleanCSS()).pipe(dest('./public'));
}

function js() {
  return src('public/**/*.js').pipe(terser()).pipe(dest('./public'));
}

exports.default = parallel(html, css, js);
