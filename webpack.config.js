var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('web/bundles/app_build/')
    .setPublicPath('/bundles/app_build/')
    .setManifestKeyPrefix('app_build')
    .addEntry('app', [
        './web/shk-app/node_modules/jquery/dist/jquery.min.js',
        './web/shk-app/node_modules/popper.js/dist/umd/popper.min.js',
        './web/shk-app/node_modules/bootstrap/dist/js/bootstrap.min.js',
        './web/shk-app/node_modules/wnumb/wNumb.js',
        './web/shk-app/node_modules/nouislider/distribute/nouislider.min.js',
        './web/shk-app/js/shopkeeper.js',
        './web/js/app.js'
    ])
    .addStyleEntry('app_styles', [
        './web/shk-app/node_modules/bootstrap/dist/css/bootstrap.min.css',
        './web/shk-app/node_modules/nouislider/distribute/nouislider.min.css',
        './web/shk-app/css/icomoon/style.css',
        './web/shk-app/css/styles.css',
        './web/css/app.css'
    ]);

module.exports = Encore.getWebpackConfig();
