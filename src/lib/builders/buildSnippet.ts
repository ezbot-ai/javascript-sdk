const fs = require('fs');

const browserify = require('browserify');
const minifyStream = require('minify-stream');

browserify('build/main/index.js')
  .transform('unassertify', { global: true })
  .transform('@browserify/envify', { global: true })
  .transform('@browserify/uglifyify', { global: true })
  // .plugin('common-shakeify')
  // .plugin('browser-pack-flat/plugin')
  .bundle()
  .pipe(minifyStream({ sourceMap: false }))
  .pipe(fs.createWriteStream('build/web-snippets/ezbot.min.js'));
