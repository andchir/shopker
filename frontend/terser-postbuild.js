'use strict';

let fs = require('fs');
let Terser = require('terser');

const sourceDirPath = '../public/admin/bundle/';
const options = {
    toplevel: true,
    compress: {
        passes: 3
    },
    output: {
        preamble: '/* minified */'
    }
};

[
    'runtime.js',
    'polyfills.js',
    'scripts.js',
    'main.js',
    'orders-orders-module-ngfactory.js',
    'catalog-catalog-module-ngfactory.js',
    'statistics-statistics-module-ngfactory.js',
    'users-users-module-ngfactory.js',
    'settings-settings-module-ngfactory.js',
    'import-export-import-export-module-ngfactory.js',
].forEach((fileName) => {
    fs.writeFileSync(sourceDirPath + fileName, Terser.minify({
        fileName: fs.readFileSync(sourceDirPath + fileName, 'utf8')
    }, options).code, 'utf8');
});
