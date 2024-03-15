/* eslint-disable @typescript-eslint/no-var-requires */

// This file may one day replace the nasty `npm run build:snippet` command.
// For now, it's breaking window.ezbot.

const fs = require('fs');

const browserify = require('browserify');
// const minifyStream = require('minify-stream');

// https://github.com/browserify/tinyify?tab=readme-ov-file#more-options
browserify('build/main/index.js')
  .transform('unassertify', { global: true })
  .transform('@browserify/envify', { global: true })
  .transform('@browserify/uglifyify', { global: true })
  // .plugin('common-shakeify') // doesn't work for me.
  // .plugin('browser-pack-flat/plugin')
  .bundle()
  // .pipe(minifyStream({ sourceMap: false, mangle: false })) // terser makes window.ezbot undefined
  .pipe(fs.createWriteStream('build/web-snippets/ezbot.min.js'));
