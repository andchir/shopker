
const $ = require('jquery');
const Shopkeeper = require('../js/shopkeeper.js');
const wNumb = require('../node_modules/wnumb/wNumb.js');
const noUiSlider = require('../node_modules/nouislider/distribute/nouislider.min.js');
require('bootstrap');

global.$ = global.jQuery = $;
global.wNumb = wNumb;
global.noUiSlider = noUiSlider;
global.shk = new Shopkeeper();

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });
});
