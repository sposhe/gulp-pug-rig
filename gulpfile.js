// modules
const fs      = require('fs')
const bsync   = require('browser-sync').create()
const webpack = require('webpack-stream')
const indexer = require('component-indexer')

// gulp
const { src, dest, series, parallel, watch } = require('gulp')

// gulp plugins
const pug                 = require('gulp-pug')
const sass                = require('gulp-sass')
const data                = require('gulp-data')
const concat              = require('gulp-concat')
const rename              = require('gulp-rename')
const replace             = require('gulp-replace')
const cleanCSS            = require('gulp-clean-css')
const sourcemaps          = require('gulp-sourcemaps')
const urlBuilder          = require('gulp-url-builder')
const autoprefixer        = require('gulp-autoprefixer')
const htmlbeautify        = require('gulp-html-beautify')
const sassExtendShorthand = require('gulp-sass-extend-shorthand')



// variables
const destination = 'docs'



// pug
function pugIndexer(cb) {
  indexer('/src/pug/includes', 'pug')
  indexer('/src/pug/mixins',   'pug')
  cb()
}
function pugCompile() {
  return src([
    'src/pug/views/**/*.pug'
  ]).pipe( pug() )
    .pipe( htmlbeautify({ indent_size: 2 }) )
    .pipe( urlBuilder() )
    .pipe( dest(destination) )
    .pipe( bsync.reload({ stream: true }) )
}
function pugWatch(cb) {
  watch(['src/pug/**/*.pug', '!**/_index.*'], series(pugIndexer, pugCompile))
  cb()
}



// sass
function sassIndexer(cb) {
  indexer('/src/scss/partials', 'scss')
  cb()
}
function sassCompile() {
  return src([
    'src/scss/**/*.+(sass|scss|css)',
    '!**/_*.*'
  ]).pipe( sourcemaps.init() )
    .pipe( sassExtendShorthand() )
    .pipe( sass({includePaths: ['node_modules']}) )
    .pipe( autoprefixer() )
    .pipe( cleanCSS() )
    .pipe( sourcemaps.write('./') )
    .pipe( dest(`${destination}/css`) )
    .pipe( bsync.reload({ stream: true }) )
}
function sassWatch(cb) {
  watch(['src/scss/**/*.+(sass|scss)', '!**/_index.*'], series(sassIndexer, sassCompile))
  cb()
}



// javascript
function jsBundle() {
  return src('src/js/app.js')
    .pipe( webpack({ mode: 'development' }) )
    .pipe( rename({ basename: 'app' }) )
    .pipe( dest(`${destination}/js`) )
    .pipe( bsync.reload({ stream: true }) )
}
function jsWatch(cb) {
  watch('src/js/**/*.js', jsBundle)
  cb()
}



// browsersync
function sync() {
  bsync.init({
    server: {
      baseDir: `./${destination}`
    }
  })
}


// exports
exports.pug     = series(pugIndexer, pugCompile)
exports.sass    = series(sassIndexer, sassCompile)
exports.js      = jsBundle
exports.build   = parallel(exports.pug, exports.sass, jsBundle)
exports.watch   = series(pugWatch, sassWatch, jsWatch)
exports.default = series(exports.build, exports.watch, sync)
