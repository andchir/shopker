var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('web/bundles/app_build/')
    .setPublicPath('/bundles/app_build/')
    .setManifestKeyPrefix('app_build')
    .createSharedEntry('common', ['jquery', 'bootstrap'])
    .addEntry('app', './web/js/app.js')
    .addStyleEntry('app_styles', [
        './web/shk-app/node_modules/bootstrap/dist/css/bootstrap.min.css',
        './web/shk-app/node_modules/nouislider/distribute/nouislider.min.css',
        './web/css/icomoon/style.css',
        './web/css/app.css'
    ])
    .autoProvidejQuery()
    .enableSourceMaps(!Encore.isProduction());

module.exports = Encore.getWebpackConfig();
