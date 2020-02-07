/**
 * Shopkeeper
 * @version 4.1.4
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

    function Shopkeeper (initOptions) {

        var self = this,
            isInitialized = false,
            isFiltersInitialized = false,
            callbacks = [];

        var mainOptions = {
            baseUrl: '/',
            multiCurrency: false,
            currencyOptions: [],
            priceElSelector: '.shk-price',
            priceFilterName: '',
            currencyTranslate: {
                RUB: 'руб.',
                UAH: 'грн'
            }
        };

        /**
         * Initialization
         * @param options
         */
        this.init = function(options) {

            options = options || {};
            if (Object.keys(options).length > 0) {
                this.extend(mainOptions, options);
            }

            this.onReady(function() {
                self.buttonsInit();
                self.currencySelectInit();
                isInitialized = true;
                self.onAfterInit();
            });
        };

        /**
         * Call function on document ready
         * @param cb
         */
        this.onReady = function(cb) {
            if (document.readyState !== 'loading') {
                cb();
            } else {
                document.addEventListener('DOMContentLoaded', cb);
            }
        };

        /**
         * Call functions after initialization
         * @param callback
         */
        this.onAfterInit = function(callback) {
            if (isInitialized) {
                if (typeof callback === 'function') {
                    callback();
                }
                callbacks.forEach(function(callbackFunc) {
                    if (typeof callbackFunc === 'function') {
                        callbackFunc();
                    }
                });
                callbacks = [];
            } else {
                callbacks.push(callback);
            }
        };

        /**
         * Update options
         * @param options
         */
        this.updateOptions = function(options) {
            if (Object.keys(options).length > 0) {
                this.extend(mainOptions, options);
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

        this.filtersInit = function(checkSelected) {
            checkSelected = checkSelected || false;
            this.slidersInit();
            if (isFiltersInitialized) {
                return;
            }

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

            if (checkSelected) {
                this.markSelected();
            }

            isFiltersInitialized = true;
        };

        this.onFilterChange = function() {
            var onFilterChangeElements = document.querySelectorAll('.shk-onfilter-change');
            onFilterChangeElements.forEach(function(element) {
                element.style.display = 'block';
            });
        };

        /**
         * Mark inputs of the filters
         */
        this.markSelected = function() {
            var urlParams = this.getUrlParams(), fieldName, fieldEl, inputType, valuesArr, value;
            var filtersContainerEl = document.getElementById('catalog-filters');
            if (!urlParams.filter || !filtersContainerEl) {
                return;
            }
            (Object.keys(urlParams.filter)).forEach(function(key) {
                fieldName = 'filter[' + key + ']';
                if (Array.isArray(urlParams.filter[key])) {
                    fieldName += '[]';
                    valuesArr = urlParams.filter[key];
                } else {
                    valuesArr = [ urlParams.filter[key] ];
                }
                valuesArr.forEach(function(value) {
                    if (typeof value.from !== 'undefined' && typeof value.to !== 'undefined') {
                        self.updateSliderValue(key, value.from, value.to);
                    } else {
                        fieldEl = filtersContainerEl.querySelector('[name="' + fieldName + '"][value="' + value + '"]');
                        if (!fieldEl) {
                            return;
                        }
                        inputType = self.getInputType(fieldEl);
                        if (inputType === 'checkbox') {
                            fieldEl.checked = true;
                        } else if (inputType === 'select') {
                            fieldEl.value = value;
                        }
                    }
                });
            });
        };

        /**
         * Get form input type
         * @param {String} element
         * @return {String}
         */
        this.getInputType = function(element) {
            if (!element) {
                return '';
            }
            var tagName = element.tagName.toLowerCase();
            if (tagName === 'select') {
                return element.tagName.toLowerCase();
            }
            if (tagName === 'input') {
                var type = element.getAttribute('type').toLowerCase();
                return type;
            }
            return '';
        };

        /**
         * Get parameters object from URL query string
         */
        this.getUrlParams = function(){
            var queryString = document.location.search.length >= 3 ? document.location.search.substr(1) : '';
            if (queryString.indexOf('?') > -1) queryString = queryString.substr(queryString.indexOf('?')+1);

            var digitTest = /^\d+$/,
                keyBreaker = /([^\[\]]+)|(\[\])/g,
                plus = /\+/g,
                paramTest = /([^?#]*)(#.*)?$/;

            if(!queryString || !paramTest.test(queryString)) {
                return {};
            }

            var data = {},
                pairs = queryString.split('&'),
                current, lastPart;

            for (var i = 0; i < pairs.length; i++) {
                current = data;
                var pair = pairs[i].split('=');

                if (pair.length !== 2) {
                    pair = [pair[0], pair.slice(1).join("=")]
                }
                var key = decodeURIComponent(pair[0].replace(plus, " ")),
                    value = decodeURIComponent(pair[1].replace(plus, " ")),
                    parts = key.match(keyBreaker);

                for (var j = 0; j < parts.length - 1; j++) {
                    var part = parts[j];
                    if (!current[part]) {
                        current[part] = digitTest.test(parts[j + 1]) || parts[j + 1] === "[]" ? [] : {}
                    }
                    current = current[part];
                }
                lastPart = parts[parts.length - 1];
                if (lastPart === "[]") {
                    current.push(value)
                } else {
                    current[lastPart] = value;
                }
            }
            return data;
        };

        this.slidersInit = function() {
            if (typeof window.wNumb === 'undefined' || typeof window.noUiSlider === 'undefined') {
                console.log('Libraries noUiSlider and wNumb not found.');
                return;
            }
            var slidersContainers = document.querySelectorAll('div.shk-slider-range');
            slidersContainers.forEach(function(sliderContainer) {
                var inputs = sliderContainer.querySelectorAll('input'),
                    filterName = sliderContainer.dataset.name;

                // Update price filter only
                if (isFiltersInitialized
                    && filterName !== mainOptions.priceFilterName) {
                        return;
                }

                var currencyRate = self.getCurrentCurrencyRate(),
                    startValueFrom = parseFloat(inputs[0].value),
                    startValueTo = parseFloat(inputs[1].value),
                    minValue = parseFloat(inputs[0].min || 0),
                    maxValue = parseFloat(inputs[0].max || 0),
                    step = parseFloat(inputs[0].step || 1),
                    wNumbFormat = wNumb({mark: '.', thousand: ' ', decimals: 0});

                if (mainOptions.multiCurrency && filterName === mainOptions.priceFilterName) {
                    startValueFrom = Math.floor(startValueFrom / currencyRate);
                    startValueTo = Math.ceil(startValueTo / currencyRate);
                    minValue = Math.floor(minValue / currencyRate);
                    maxValue = Math.ceil(maxValue / currencyRate);
                }

                if (startValueTo - startValueFrom <= 10) {
                    wNumbFormat = wNumb({mark: '.', thousand: ' ', decimals: 2});
                    step = 0.1;
                }

                var options = {
                    connect: true,
                    step: step,
                    start: [startValueFrom, startValueTo],
                    range: {
                        'min': minValue,
                        'max': maxValue
                    },
                    format: wNumbFormat,
                    tooltips: [ true, true ],
                    pips: {
                        mode: 'positions',
                        values: [0, 105],
                        density: 4,
                        format: wNumbFormat
                    }
                };

                if (!sliderContainer.noUiSlider) {
                    noUiSlider.create(sliderContainer, options);
                } else {
                    sliderContainer.noUiSlider.updateOptions(options);
                }

                sliderContainer.noUiSlider.on('update', function(values, handle) {
                    if (mainOptions.multiCurrency && filterName === mainOptions.priceFilterName) {
                        inputs[0].value = wNumbFormat.from(values[0]) * currencyRate;
                        inputs[1].value = wNumbFormat.from(values[1]) * currencyRate;
                    } else {
                        inputs[0].value = wNumbFormat.from(values[0]);
                        inputs[1].value = wNumbFormat.from(values[1]);
                    }
                });
                sliderContainer.noUiSlider.on('change', function(values, handle) {
                    self.onFilterChange();
                });
            });
        };

        /**
         * Update slider values
         * @param fieldName
         * @param valueFrom
         * @param valueTo
         */
        this.updateSliderValue = function(fieldName, valueFrom, valueTo) {
            if (typeof window.wNumb === 'undefined' || typeof window.noUiSlider === 'undefined') {
                console.log('Libraries noUiSlider and wNumb not found.');
                return;
            }
            var slidersContainers = document.querySelectorAll('div.shk-slider-range');
            slidersContainers.forEach(function(sliderContainer) {
                if (sliderContainer.dataset.name !== fieldName || !sliderContainer.noUiSlider) {
                    return;
                }
                var inputs = sliderContainer.querySelectorAll('input'),
                    currencyRate = self.getCurrentCurrencyRate(),
                    wNumbFormat = wNumb({mark: '.', thousand: ' ', decimals: 0});

                if (mainOptions.multiCurrency && fieldName === mainOptions.priceFilterName) {
                    valueFrom = Math.floor(parseFloat(valueFrom) / currencyRate);
                    valueTo = Math.ceil(parseFloat(valueTo) / currencyRate);
                    inputs[0].value = wNumbFormat.from(valueFrom) * currencyRate;
                    inputs[1].value = wNumbFormat.from(valueTo) * currencyRate;
                } else {
                    inputs[0].value = wNumbFormat.from(valueFrom);
                    inputs[1].value = wNumbFormat.from(valueTo);
                }

                sliderContainer.noUiSlider.updateOptions({
                    start: [valueFrom, valueTo]
                });
            });
        };

        /**
         *
         * @param currentUrl
         * @param orderBy
         * @param orderByVar
         */
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

        /**
         *
         * @param listType
         */
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
         * @param {string} formSelector
         * @param {string} priceElSelector
         */
        this.productParametersInit = function(formSelector, priceElSelector) {
            priceElSelector = priceElSelector || mainOptions.priceElSelector;
            var formEl = document.querySelector(formSelector),
                priceEl = formEl.querySelector(priceElSelector);
            if (!formEl || !priceEl) {
                return;
            }
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

            var selectElement = document.getElementById('shk-currency');
            if (selectElement) {
                selectElement.addEventListener('change', function(e) {
                    self.productParametersApply(formSelector, priceElSelector);
                }, false);
            }

            this.productParametersApply(formSelector, priceElSelector);
        };

        /**
         * Apply product parameters
         * @param {string} formSelector
         * @param {string} priceElSelector
         */
        this.productParametersApply = function(formSelector, priceElSelector) {
            priceElSelector = priceElSelector || mainOptions.priceElSelector;
            var formEl = document.querySelector(formSelector),
                priceEl = formEl.querySelector(priceElSelector);
            if (!formEl || !priceEl) {
                return;
            }

            if (!priceEl.dataset.originalPrice) {
                priceEl.dataset.originalPrice = priceEl.tagName.toLowerCase() === 'input'
                    ? self.parsePrice(priceEl.value)
                    : self.parsePrice(priceEl.textContent);
            }

            var price = this.parsePrice(priceEl.dataset.originalPrice),
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

            priceEl.dataset.tempPrice = price;
            priceEl.textContent = self.numFormat(price);
            this.updateProductsPrice(null, formEl);
        };

        /**
         * Parse price string
         * @param priceStr
         * @returns {Number}
         */
        this.parsePrice = function(priceStr) {
            return parseFloat(priceStr.replace(/[^\d\.]/g,''));
        };

        this.currencySelectInit = function() {
            var selectElement = document.getElementById('shk-currency');
            if (!selectElement) {
                return;
            }
            selectElement.value = this.getCurrentCurrency();
            selectElement.addEventListener('change', function(e) {
                self.setCookie('shkCurrency', this.value, 7);
                self.slidersInit();
                self.updateProductsPrice(this.value);
            }, false);

            if (mainOptions.currencyOptions.length === 0) {
                var optionEls = selectElement.querySelectorAll('option');
                if (optionEls.length > 1) {
                    mainOptions.multiCurrency = true;
                    optionEls.forEach(function(optionEl) {
                        var rate = optionEl.dataset.rate || '1';
                        rate = parseFloat(rate);
                        mainOptions.currencyOptions.push({name: optionEl.value, rate: rate});
                    });
                    this.updateProductsPrice();
                }
            }
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
         * Get currency rate
         * @param currency
         * @returns {number}
         */
        this.getCurrentCurrencyRate = function(currency) {
            if (!currency) {
                currency = this.getCurrentCurrency();
            }
            var currentRate, tmp = mainOptions.currencyOptions.filter(function(opt) {
                return opt.name === currency;
            });
            if (tmp.length === 0) {
                return 1;
            }
            return tmp[0].rate;
        };

        /**
         * Update products price
         * @param currency
         * @param parentEl
         */
        this.updateProductsPrice = function(currency, parentEl) {
            parentEl = parentEl || document;
            if (!mainOptions.multiCurrency) {
                return;
            }
            if (!currency) {
                currency = this.getCurrentCurrency();
            }
            var currentRate, tmp = mainOptions.currencyOptions.filter(function(opt) {
                return opt.name === currency;
            });
            if (tmp.length === 0) {
                return;
            }
            currentRate = tmp[0].rate;

            var priceElArr = parentEl.querySelectorAll('.shk-price'),
                currencyElArr = parentEl.querySelectorAll('.shk-currency');
            // Update price
            priceElArr.forEach(function(priceEl) {
                if (!priceEl.dataset.originalPrice) {
                    priceEl.dataset.originalPrice = priceEl.tagName.toLowerCase() === 'input'
                        ? self.parsePrice(priceEl.value)
                        : self.parsePrice(priceEl.textContent);
                }
                var originalPrice = parseFloat(priceEl.dataset.tempPrice || priceEl.dataset.originalPrice);
                if (priceEl.tagName.toLowerCase() === 'input') {
                    priceEl.value = self.getPriceByRate(originalPrice, currentRate).toFixed(2).replace(',', '.');
                } else {
                    priceEl.textContent = self.numFormat(self.getPriceByRate(originalPrice, currentRate));
                }
                delete priceEl.dataset.tempPrice;
            });
            // Update currency
            currencyElArr.forEach(function(currencyEl) {
                currencyEl.textContent = mainOptions.currencyTranslate[currency] || currency;
            });
        };

        this.getPriceByRate = function(price, rate) {
            return price / rate;
        };

        /**
         * Upload file to order
         * @param {number} categoryId
         * @param {string} buttonUploadSelector
         * @param {string} buttonUploadCancelSelector
         * @param {string} fileNameSelector
         * @param {string} type
         */
        this.orderUploadFileInit = function(categoryId, buttonUploadSelector, buttonUploadCancelSelector, fileNameSelector, type) {
            type = type || 'shop';
            var buttonUploadEl = document.querySelector(buttonUploadSelector),
                buttonUploadCancelEl = document.querySelector(buttonUploadCancelSelector),
                fileNameEl = document.querySelector(fileNameSelector),
                fileAccept = buttonUploadEl.dataset.accept || '',
                hiddenFieldEl = document.createElement('input'),
                fileFieldEl = document.createElement('input'),
                fileFieldName = buttonUploadEl.name || 'file';

            hiddenFieldEl.type = 'hidden';
            hiddenFieldEl.name = fileFieldName;
            buttonUploadEl.parentNode.appendChild(hiddenFieldEl);

            fileFieldEl.type = 'file';
            fileFieldEl.style.display = 'none';
            if (fileAccept) {
                fileFieldEl.accept = fileAccept;
            }
            buttonUploadEl.name = 'button-' + fileFieldName;
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
                buttonUploadCancelEl.disabled = true;

                var fileData;
                if (fileNameEl) {
                    fileData = self.getFileData(fileList[0]);
                    fileNameEl.textContent = fileData.title + '.' + fileData.extension;
                    fileNameEl.style.display = fileNameEl.tagName.toLowerCase() === 'div'
                        ? 'block'
                        : 'inline-block';
                }

                self.showPreloaderToggle(true);

                var formData = new FormData();
                formData.append(fileFieldName, fileList[0]);
                formData.append('categoryId', categoryId);
                formData.append('type', type);

                self.ajax(mainOptions.baseUrl + 'files/user_upload', formData, function(data) {
                    if (data.filesIds && Array.isArray(data.filesIds)) {
                        hiddenFieldEl.value = data.filesIds;
                    }
                    buttonUploadCancelEl.disabled = false;
                    self.showPreloaderToggle(false);
                }, function (data) {
                    if (data.error) {
                        if (fileFieldEl) {
                            fileNameEl.innerHTML = '<span style="color: red;">' + data.error + '</span>';
                        } else {
                            alert(data.error);
                        }
                    }
                    buttonUploadCancelEl.disabled = false;
                    self.showPreloaderToggle(false);
                }, 'POST');
            });

            buttonUploadEl.addEventListener('click', function(event) {
                event.preventDefault();
                fileFieldEl.click();
            });

            buttonUploadCancelEl.addEventListener('click', function(event) {
                event.preventDefault();
                buttonUploadEl.disabled = false;
                fileFieldEl.value = '';
                hiddenFieldEl.value = '';
                buttonUploadCancelEl.style.display = 'none';
                fileNameEl.textContent = '';
                fileNameEl.style.display = 'none';
            });
        };

        /**
         * Show loading animation
         * @param show
         */
        this.showPreloaderToggle = function(show) {
            show = show || false;
            var preloaderEl = document.getElementById('shk-preloader');
            if (!preloaderEl) {
                preloaderEl = document.createElement('div');
                preloaderEl.id = 'shk-preloader';
                preloaderEl.innerHTML = '<div></div>';
                document.body.appendChild(preloaderEl);
            }
            preloaderEl.style.display = show ? 'block' : 'none';
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
         * Extend object
         * @param out
         * @returns {*|{}}
         */
        this.extend = function(out) {
            out = out || {};
            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;
                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }
            return out;
        };

        /**
         * Ajax request
         * @param url
         * @param data
         * @param successFn
         * @param failFn
         * @param method
         */
        this.ajax = function(url, data, successFn, failFn, method) {
            method = method || 'GET';
            var request = new XMLHttpRequest();
            request.open(method, url, true);

            request.onload = function() {
                var result = ['{','['].indexOf(request.responseText.substr(0,1)) > -1
                    ? JSON.parse(request.responseText)
                    : {};
                if (request.status >= 200 && request.status < 400) {
                    if (typeof successFn === 'function') {
                        successFn(result);
                    }
                } else {
                    if (typeof failFn === 'function') {
                        failFn(result);
                    }
                }
            };

            request.onerror = function() {
                if (typeof failFn === 'function') {
                    failFn(request);
                }
            };

            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (!(data instanceof FormData)) {
                request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            }

            if (method === 'POST') {
                request.send(data);
            } else {
                request.send();
            }
        };

        /**
         * Check is hex color
         * @param sNum
         * @returns {boolean}
         */
        this.isHexColor = function(sNum){
            return (typeof sNum === 'string')
                && (sNum.length === 6 || sNum.length === 3)
                && !isNaN(parseInt(sNum, 16));
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

        /**
         * Get is float
         * @param number
         * @returns {boolean}
         */
        this.isFloat = function(number) {
            return /[^\d]/.test(number.toString());
        };

        this.init(initOptions);
    }

    return Shopkeeper;

}));
