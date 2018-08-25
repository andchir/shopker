var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('bundles/app_build/')
    .setPublicPath('/bundles/app_build/')
    .setManifestKeyPrefix('app_build')
    .addEntry('app', './js/app.js')
    .addStyleEntry('app_styles', [
        './node_modules/bootstrap/dist/css/bootstrap.min.css',
        './node_modules/nouislider/distribute/nouislider.min.css',
        './css/icomoon/style.css',
        './css/app.css'
    ])
    .cleanupOutputBeforeBuild()
    .autoProvidejQuery()
    .enableSourceMaps(!Encore.isProduction());

module.exports = Encore.getWebpackConfig();
