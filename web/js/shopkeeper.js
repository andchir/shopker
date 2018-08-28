/**
 * Shopkeeper
 * @version 4.0.0beta6
 * @author Andchir<andchir@gmail.com>
 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.Shopkeeper = factory();
    }

}(function( ){

    'use strict';

    function Shopkeeper () {

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
            if (typeof window.wNumb === 'undefined' || typeof window.noUiSlider === 'undefined') {
                console.log('Libraries noUiSlider and wNumb not found.');
                return;
            }
            var slidersContainers = document.querySelectorAll('div.shk-slider-range');
            slidersContainers.forEach(function(sliderContainer) {
                var inputs = sliderContainer.querySelectorAll('input');
                if (inputs.length < 2
                    || parseFloat(inputs[0].value) === parseFloat(inputs[1].value)) {
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

        /**
         * Initialize product parameters
         * @param formSelector
         * @param priceElSelector
         */
        this.productParametersInit = function(formSelector, priceElSelector) {
            var formEl = document.querySelector(formSelector),
                priceEl = document.querySelector(priceElSelector);
            if (!formEl || !priceEl) {
                return;
            }
            priceEl.dataset.price = this.parsePrice(priceEl.textContent);

            var parametersInputs = formEl.querySelectorAll('input, select');

            parametersInputs.forEach(function(inputEl) {
                var name = (inputEl.getAttribute('name') || '').toLowerCase();
                if (name.indexOf('param__') === -1) {
                    return;
                }
                var inputType = self.getInputType(inputEl);
                switch (inputType) {
                    case 'checkbox':
                    case 'radio':
                        inputEl.addEventListener('click', function(){
                            self.productParametersApply(formSelector, priceElSelector);
                        });
                        break;
                    case 'select':
                        inputEl.addEventListener('change', function(){
                            self.productParametersApply(formSelector, priceElSelector);
                        });
                        break;
                }
            });

            this.productParametersApply(formSelector, priceElSelector);
        };

        /**
         * Apply product parameters
         * @param formSelector
         * @param priceElSelector
         */
        this.productParametersApply = function(formSelector, priceElSelector) {
            var formEl = document.querySelector(formSelector),
                priceEl = document.querySelector(priceElSelector);
            if (!formEl || !priceEl) {
                return;
            }

            var price = this.parsePrice(priceEl.dataset.price || priceEl.textContent),
                parametersInputs = formEl.querySelectorAll('input, select');

            parametersInputs.forEach(function(inputEl) {
                var name = (inputEl.getAttribute('name') || '').toLowerCase();
                if (name.indexOf('param__') === -1) {
                    return;
                }
                var inputType = self.getInputType(inputEl);
                switch (inputType) {
                    case 'checkbox':
                    case 'radio':
                        if (inputEl.checked) {
                            price += self.parsePrice(inputEl.dataset.price || '0');
                        }
                        break;
                    case 'select':

                        var value = inputEl.value,
                            optionElArr = inputEl.querySelectorAll('option');

                        optionElArr.forEach(function(optionEl) {
                            if (optionEl.value === value) {
                                price += self.parsePrice(optionEl.dataset.price || '0');
                            }
                        });
                        break;
                }
            });

            priceEl.textContent = this.numFormat(price);
        };

        /**
         * Parse price string
         * @param priceStr
         * @returns {Number}
         */
        this.parsePrice = function(priceStr) {
            return parseFloat(priceStr.replace(/[^\d\.]/g,''));
        };

        /**
         * Get type of the input element
         * @param inputEl
         * @returns {string}
         */
        this.getInputType = function(inputEl) {
            var tagName = inputEl.tagName.toLowerCase(),
                inputType = tagName === 'input'
                    ? inputEl.getAttribute('type').toLowerCase()
                    : '';
            if (tagName === 'select') {
                inputType = 'select';
            }
            return inputType;
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

        /**
         * Upload file to order
         * @param buttonUploadSelector
         * @param buttonUploadCancelSelector
         * @param fileNameSelector
         */
        this.orderUploadFileInit = function(buttonUploadSelector, buttonUploadCancelSelector, fileNameSelector) {
            var buttonUploadEl = document.querySelector(buttonUploadSelector),
                buttonUploadCancelEl = document.querySelector(buttonUploadCancelSelector),
                fileNameEl = document.querySelector(fileNameSelector),
                fileAccept = buttonUploadEl.dataset.accept || '',
                fileFieldEl = document.createElement('input'),
                fieldName = buttonUploadEl.name || 'file';

            fileFieldEl.type = 'file';
            fileFieldEl.name = fieldName;
            fileFieldEl.style.display = 'none';
            if (fileAccept) {
                fileFieldEl.accept = fileAccept;
            }
            buttonUploadEl.name = 'button-' + fieldName;
            buttonUploadEl.parentNode.appendChild(fileFieldEl);
            buttonUploadCancelEl.style.display = 'none';
            fileNameEl.style.display = 'none';

            fileFieldEl.addEventListener('change', function(event) {
                var fileList = event.target.files;
                if (fileList.length === 0) {
                    return;
                }
                buttonUploadEl.disabled = true;
                buttonUploadCancelEl.style.display = 'inline-block';
                //buttonUploadCancelEl.disabled = true;

                if (fileNameEl) {
                    var fileData = self.getFileData(fileList[0]);
                    fileNameEl.textContent = fileData.title + '.' + fileData.extension;
                    fileNameEl.style.display = fileNameEl.tagName.toLowerCase() === 'div'
                        ? 'block'
                        : 'inline-block';
                }
            });

            buttonUploadEl.addEventListener('click', function(event) {
                event.preventDefault();
                fileFieldEl.click();
            });

            buttonUploadCancelEl.addEventListener('click', function(event) {
                event.preventDefault();
                buttonUploadEl.disabled = false;
                fileFieldEl.value = '';
                buttonUploadCancelEl.style.display = 'none';
                fileNameEl.textContent = '';
                fileNameEl.style.display = 'none';
            });
        };

        /**
         * Get file data from field
         * @param file
         * @returns {{title: (string|*), extension: (string|*), size}}
         */
        this.getFileData = function(file) {
            var title = file.name.substr(0, file.name.lastIndexOf('.')),
                extension = file.name.substr(file.name.lastIndexOf('.') + 1),
                size = file.size;

            return {
                title: title,
                extension: extension,
                size: size
            };
        };

        /**
         * Set cookie
         * @param name
         * @param value
         * @param days
         */
        this.setCookie = function(name, value, days) {
            var expires = '';
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = '; expires=' + date.toUTCString();
            }
            document.cookie = name + '=' + (value || '')  + expires + '; path=/';
        };

        /**
         * Get cookie
         * @param name
         * @returns {*}
         */
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

        /**
         * Erase cookie
         * @param name
         */
        this.eraseCookie = function(name) {
            document.cookie = name + '=; Max-Age=-99999999;';
        };

        /**
         * Number format for price
         * @param n
         */
        this.numFormat = function(n){
            return this.number_format(n, (Math.floor(n)===n ? 0 : 2), '.', ' ');
        };

        /**
         * Number format
         * @param number
         * @param decimals
         * @param dec_point
         * @param thousands_sep
         */
        this.number_format = function(number, decimals, dec_point, thousands_sep) {
            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k;
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        };

        this.init();
    }

    return Shopkeeper;

}));
