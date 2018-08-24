
const $ = require('jquery');
const Shopkeeper = require('../shk-app/js/shopkeeper.js');
const wNumb = require('../shk-app/node_modules/wnumb/wNumb.js');
const noUiSlider = require('../shk-app/node_modules/nouislider/distribute/nouislider.min.js');
require('bootstrap');

global.$ = global.jQuery = $;
global.wNumb = wNumb;
global.noUiSlider = noUiSlider;
global.Shopkeeper = Shopkeeper;

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
