
const $ = require('jquery');
const Shopkeeper = require('../js/shopkeeper.js');
const DotsMenu = require('../js/dots-menu.js');
const wNumb = require('../node_modules/wnumb/wNumb.js');
const noUiSlider = require('../node_modules/nouislider/distribute/nouislider.min.js');
const slick = require('../node_modules/slick-carousel/slick/slick.min.js');
const ShoppingCart = require('../js/shopping_cart.js');
require('bootstrap');

global.$ = global.jQuery = $;
global.wNumb = wNumb;
global.noUiSlider = noUiSlider;
global.DotsMenu = DotsMenu;
global.shk = new Shopkeeper();
global.dotsMenu = new DotsMenu({
    fixedMode: true,
    dotsMenuButtonPosition: 'left',
    rightSpace: 165
});
global.ShoppingCart = ShoppingCart;

$(document).ready(function() {
    
    $('[data-toggle="tooltip"],.js-tooltip').tooltip({
        trigger: 'hover',
        placement: 'bottom'
    });

    $('.responsive-carousel').each(function(index, el) {
        if ($(el).children().length > 4) {
            $(el).slick({
                dots: true,
                infinite: false,
                arrows: false,
                speed: 300,
                slidesToShow: 4,
                slidesToScroll: 4,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        }
    });
});

