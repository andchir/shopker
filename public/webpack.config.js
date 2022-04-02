var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('app_build/')
    .setPublicPath('.')
    .setManifestKeyPrefix('app_build')
    .addEntry('app', './js/app.js')
    .addStyleEntry('app_styles', [
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/nouislider/dist/nouislider.css',
        './node_modules/slick-carousel/slick/slick.css',
        './node_modules/slick-carousel/slick/slick-theme.css',
        './css/icomoon/style.css',
        './css/dots-menu.css',
        './css/shopkeeper.css',
        './css/shopping_cart.css',
        './css/app.css'
    ])
    .cleanupOutputBeforeBuild()
    .autoProvidejQuery()
    .enableSourceMaps(!Encore.isProduction())
    .disableSingleRuntimeChunk();

module.exports = Encore.getWebpackConfig();
