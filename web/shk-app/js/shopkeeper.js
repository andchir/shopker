/**
 * Shopkeeper
 * @version 4.0.0alpha
 * @author Andchir<andchir@gmail.com>
 */

var Shopkeeper = function () {

    'use strict';

    var self = this;

    this.init = function() {
        this.onReady(function() {

            self.buttonsInit();
            self.filtersInit();
            self.currencySelectInit();

        });
    };

    this.onReady = function(cb) {
        if (document.readyState !== 'loading') {
            cb();
        } else {
            document.addEventListener('DOMContentLoaded', cb);
        }
    };

    this.buttonsInit = function() {
        var buttonsFiltersHide = document.querySelectorAll('.shk-button-filters-hide');
        buttonsFiltersHide.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (document.getElementById('catalog-filters')) {
                    document.getElementById('catalog-filters').style.display = 'none';
                    self.setCookie('filters-hidden', 1);
                }
            }, false);
        });

        var buttonsFiltersShow = document.querySelectorAll('.shk-button-filters-show');
        buttonsFiltersShow.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (document.getElementById('catalog-filters')) {
                    document.getElementById('catalog-filters').style.display = 'block';
                    self.setCookie('filters-hidden', 0);
                }
            }, false);
        });

        if (this.getCookie('filters-hidden')) {
            if (document.getElementById('catalog-filters')) {
                document.getElementById('catalog-filters').style.display = 'none';
            }
        }
    };

    this.filtersInit = function() {
        this.slidersInit();

        var filtersInputs = document.querySelectorAll('.filter-block input, .filter-block select');
        filtersInputs.forEach(function(input){
            switch (input.tagName.toLowerCase()) {
                case 'input':

                    if (['checkbox', 'radio'].indexOf(input.getAttribute('type'))) {
                        input.addEventListener('click', self.onFilterChange.bind(self), false);
                    } else if (['range', 'select'].indexOf(input.getAttribute('type'))) {
                        input.addEventListener('change', self.onFilterChange.bind(self), false);
                    }

                    break;
            }
        });

    };

    this.onFilterChange = function() {
        var onFilterChangeElements = document.querySelectorAll('.shk-onfilter-change');
        onFilterChangeElements.forEach(function(element) {
            element.style.display = 'block';
        });
    };

    this.slidersInit = function() {
        if (typeof wNumb === 'undefined' || typeof noUiSlider === 'undefined') {
            console.log('Libraries noUiSlider and wNumb not found.');
            return;
        }
        var slidersContainers = document.querySelectorAll('div.shk-slider-range');
        slidersContainers.forEach(function(sliderContainer) {
            var inputs = sliderContainer.querySelectorAll('input');
            if (inputs.length < 2) {
                return;
            }
            var minValue = parseFloat(inputs[0].min || 0),
                maxValue = parseFloat(inputs[0].max || 0),
                step = parseFloat(inputs[0].step || 1),
                wNumbFormat = wNumb({mark: '.', thousand: ' ', decimals: 0});
            noUiSlider.create(sliderContainer, {
                connect: true,
                step: step,
                start: [parseFloat(inputs[0].value), parseFloat(inputs[1].value)],
                range: {
                    'min': minValue,
                    'max': maxValue
                },
                format: wNumbFormat,
                tooltips: [ true, true ],
                pips: {
                    mode: 'range',
                    density: 4,
                    format: wNumbFormat
                }
            });
            sliderContainer.noUiSlider.on('update', function(values, handle) {
                inputs[0].value = wNumbFormat.from(values[0]);
                inputs[1].value = wNumbFormat.from(values[1]);
            });
            sliderContainer.noUiSlider.on('change', function(values, handle) {
                self.onFilterChange();
            });
        });
    };

    this.orderByChange = function(currentUrl, orderBy, orderByVar) {
        var qsArr = currentUrl.split(/[\?&]/),
            newUrl = qsArr.shift();
        orderByVar = orderByVar || 'order_by';
        qsArr.forEach(function(qs){
            var tmpArr = qs.split('='),
                sep = newUrl.indexOf('?') > -1 ? '&' : '?';
            if (tmpArr[0] === orderByVar) {
                newUrl += sep + orderByVar + '=' + orderBy;
            } else {
                newUrl += sep + qs;
            }
        });
        window.location.href = newUrl;
    };

    this.catalogListChange = function(listType) {
        var currentValue = this.getCookie('shkListType');
        if (currentValue === listType) {
            return;
        }
        this.setCookie('shkListType', listType, 7);
        window.location.reload();
    };

    this.currencySelectInit = function() {
        var selectElement = document.getElementById('shk-currency');
        if (!selectElement) {
            return;
        }
        selectElement.value = this.getCurrentCurrency();
        selectElement.addEventListener('change', function(e) {
            self.setCookie('shkCurrency', this.value, 7);
        }, false);
    };

    this.getCurrentCurrency = function() {
        var currencyCookie = this.getCookie('shkCurrency');
        if (currencyCookie) {
            return currencyCookie;
        }
        var currentCurrency = document.getElementById('shk-currency')
            ? document.getElementById('shk-currency').value
            : '';
        this.setCookie('shkCurrency', currentCurrency, 7);
        return currentCurrency;
    };

    this.setCookie = function(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '')  + expires + '; path=/';
    };

    this.getCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    this.eraseCookie = function(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    };

    this.init();
};
