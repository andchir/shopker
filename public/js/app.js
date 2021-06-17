
const $ = require('jquery');
const bootstrap = require('../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');
const Shopkeeper = require('../js/shopkeeper.js');
const DotsMenu = require('../js/dots-menu.js');
const wNumb = require('../node_modules/wnumb/wNumb.js');
const noUiSlider = require('../node_modules/nouislider/distribute/nouislider.min.js');
const slick = require('../node_modules/slick-carousel/slick/slick.min.js');
const ShoppingCart = require('../js/shopping_cart.js');

global.$ = global.jQuery = $;
global.bootstrap = bootstrap;
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

document.addEventListener('DOMContentLoaded', function(event) {

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            popperConfig: function (defaultBsPopperConfig) {
                return Object.assign({}, defaultBsPopperConfig, {
                    placement: 'bottom'
                });
            }
        });
    });

    var dropdownTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
    var dropdownList = dropdownTriggerList.map(function (dropdownTriggerEl) {
        return new bootstrap.Dropdown(dropdownTriggerEl);
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

