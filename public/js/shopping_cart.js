/**
 * ShoppingCart
 * @version 1.0.1
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
        window.ShoppingCart = factory();
    }

}(function( ){

    'use strict';

    function ShoppingCart(options) {

        var TYPE_MAIN = 'shop';
        var self = this, isInitialized = false, container = null, shoppingCartContentType = '';

        var mainOptions = {
            baseUrl: '/',
            connectorUrl: 'assets/components/shopping_cart/connector.php',
            snippetPropertySetName: '',
            selector: '',
            useNumberFormat: true,
            selectorPriceTotal: '.shopping-cart-price-total',
            selectorCountTotal: '.shopping-cart-count-total',
            selectorCountUniqueTotal: '.shopping-cart-count-unique-total',
            selectorDeclension: '.shopping-cart-declension',
            productFormSelector: '',
            templateName: '',
            autoUpdateElements: false
        };

        this.data = {
            shop: {
                price_total: 0,
                items_total: 0,
                items_unique_total: 0,
                delivery_name: '',
                delivery_price: 0,
                ids: []
            }
        };

        /**
         * Initialization
         */
        this.init = function() {
            options = options || {};
            if (Object.keys(options).length > 0) {
                this.extend(mainOptions, options);
            }
            if (mainOptions.selector) {
                container = document.querySelector(mainOptions.selector);
                if (!container && console && console.log) {
                    console.log('[ShoppingCart] Container selector not found.');
                }
            }
            this.submitFormInit();
            this.productSubmitFormInit();
            if (typeof options.data === 'object') {
                this.updateData(options.data);
                delete mainOptions.data;
            }
            isInitialized = true;
        };

        /**
         * Add event listener
         * @param {string} eventName
         * @param {function} callbackFunc
         * @param {object|boolean} options
         * @returns {ShoppingCart}
         */
        this.addEventListener = function(eventName, callbackFunc, options) {
            eventName = this.capitalizeString(eventName);
            eventName += '_' + shoppingCartContentType;
            if (options) {
                window.addEventListener('ShopCart' + eventName, callbackFunc, options);
            } else {
                window.addEventListener('ShopCart' + eventName, callbackFunc);
            }
            return this;
        };

        /**
         * Dispatch event
         * @param eventName
         * @param eventData
         */
        this.dispatchEvent = function(eventName, eventData) {
            eventName = this.capitalizeString(eventName);
            eventName += '_' + shoppingCartContentType;
            window.dispatchEvent(new CustomEvent('ShopCart' + eventName, {
                detail: eventData || {}
            }));
        };

        /**
         * Submit shopping cart form initialize
         */
        this.submitFormInit = function() {
            if (!container) {
                return;
            }
            var formEl = container.querySelector('form'),
                actionName = '',
                actionValue = '';
            if (!shoppingCartContentType) {
                self.updateShoppingCartContentType(formEl);
            }
            if (!formEl) {
                if (console && console.log) {
                    console.log('[ShoppingCart] Shopping Cart form element not found.');
                }
                return;
            }
            formEl.addEventListener('submit', function(event) {
                event.preventDefault();
                var formData = new FormData(formEl);
                formData.append(actionName, actionValue);
                if (mainOptions.snippetPropertySetName) {
                    formData.append('propertySetName', mainOptions.snippetPropertySetName);
                }
                if (mainOptions.templateName) {
                    formData.append('templateName', mainOptions.templateName);
                }
                self.dispatchEvent('formSubmitBefore', {element: formEl, formData: formData});
                self.formDataSend(formData);
            });
            formEl.querySelectorAll('[type="submit"]').forEach(function(buttonEl) {
                buttonEl.addEventListener('click', function(event) {
                    actionName = buttonEl.getAttribute('name');
                    actionValue = buttonEl.value;
                });
            });
        };

        /**
         * Update shopping cart type
         * @param formEl
         */
        this.updateShoppingCartContentType = function(formEl) {
            if (!formEl) {
                return;
            }
            var typeInputEl = formEl.querySelector('input[name="type"]');
            shoppingCartContentType = typeInputEl ? typeInputEl.value : TYPE_MAIN;
        };

        /**
         * Product add to shopping cart initialize
         */
        this.productSubmitFormInit = function() {
            if (!mainOptions.productFormSelector) {
                return;
            }
            var forms = document.querySelectorAll(mainOptions.productFormSelector),
                actionName = '',
                actionValue = '';
            if (!shoppingCartContentType && forms.length > 0) {
                self.updateShoppingCartContentType(forms[0]);
            }
            forms.forEach(function(formEl) {
                formEl.addEventListener('submit', function(event) {
                    event.preventDefault();

                    var formData = new FormData(formEl);
                    actionValue = actionValue || 'add_to_cart';
                    formData.append('action', actionValue);
                    if (mainOptions.snippetPropertySetName) {
                        formData.append('propertySetName', mainOptions.snippetPropertySetName);
                    }
                    if (mainOptions.templateName) {
                        formData.append('templateName', mainOptions.templateName);
                    }
                    self.dispatchEvent('formSubmitBefore', {element: formEl, formData: formData});
                    self.formDataSend(formData, formEl);
                });
                formEl.querySelectorAll('[type="submit"]').forEach(function(buttonEl) {
                    buttonEl.addEventListener('click', function(event) {
                        actionName = buttonEl.getAttribute('name');
                        actionValue = buttonEl.value;
                    });
                });
            });
        };

        /**
         * Replace content of container element
         * @param html
         */
        this.containerUpdate = function(html) {
            if (!mainOptions.selector) {
                return;
            }
            if (container) {
                container.outerHTML = html;
            }
            container = document.querySelector(mainOptions.selector);
            this.submitFormInit();
        };

        /**
         * Update shopping cart data
         * @param {object} data
         */
        this.updateData = function(data) {
            var type = data.type || shoppingCartContentType;
            if (!this.data[type]) {
                this.data[type] = {};
            }
            this.data[type].price_total = data.price_total || 0;
            this.data[type].items_total = data.items_total || 0;
            this.data[type].items_unique_total = data.items_unique_total || 0;
            this.data[type].delivery_name = data.delivery_name || '';
            this.data[type].delivery_price = data.delivery_price || 0;
            this.data[type].ids = data.ids || [];
        };

        /**
         * Update the contents of elements with data of the shopping cart
         * @param {object} data
         */
        this.updateElementsBySelectors = function(data) {
            if (data) {
                this.updateData(data);
            }
            var elementsTotalPrice = mainOptions.selectorPriceTotal
                    ? document.querySelectorAll(mainOptions.selectorPriceTotal)
                    : [],
                elementsCountTotal = mainOptions.selectorCountTotal
                    ? document.querySelectorAll(mainOptions.selectorCountTotal)
                    : [],
                elementsCountUniqueTotal = mainOptions.selectorCountUniqueTotal
                    ? document.querySelectorAll(mainOptions.selectorCountUniqueTotal)
                    : [],
                elementsDeclension = mainOptions.selectorDeclension
                    ? document.querySelectorAll(mainOptions.selectorDeclension)
                    : [];

            elementsTotalPrice.forEach(function (el) {
                el.textContent = mainOptions.useNumberFormat
                    ? self.numFormat(self.data[shoppingCartContentType].price_total)
                    : self.data[shoppingCartContentType].price_total;
            });
            elementsCountTotal.forEach(function (el) {
                el.textContent = self.data[shoppingCartContentType].items_total;
            });
            elementsCountUniqueTotal.forEach(function (el) {
                el.textContent = self.data[shoppingCartContentType].items_unique_total;
            });
            elementsDeclension.forEach(function (el) {
                var words = el.dataset.value ? el.dataset.value.split('|') : [];
                if (words.length === 0) {
                    return;
                }
                el.textContent = self.wordDeclension(self.data[shoppingCartContentType].items_total, words);
            });
        };

        /**
         * Send FormData to connector
         * @param {FormData} formData
         * @param {HTMLElement} formEl
         */
        this.formDataSend = function(formData, formEl) {
            this.showLoading(true);
            self.ajax(mainOptions.baseUrl + mainOptions.connectorUrl, formData, function(response) {
                if (!response.success) {
                    self.showLoading(false);
                    self.dispatchEvent('load', {response: response, container: container, element: formEl || null});
                    return;
                }
                self.updateData(response);
                if (mainOptions.autoUpdateElements) {
                    self.updateElementsBySelectors(response);
                }
                if (typeof response.html !== 'undefined') {
                    self.containerUpdate(response.html);
                }
                self.showLoading(false);
                self.dispatchEvent('load', {response: response, container: container, element: formEl || null});
            }, function(response) {
                self.showLoading(false);
                self.dispatchEvent('load', {response: response, container: container, element: formEl || null});
            }, 'POST');
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
                self.dispatchEvent('requestAfter', {request: request});
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
            this.dispatchEvent('requestBefore', {request: request});
            if (method === 'POST') {
                request.send(data);
            } else {
                request.send();
            }
        };

        /**
         * Show loading animation
         * @param show
         */
        this.showLoading = function(show) {
            if (!container) {
                return;
            }
            show = show || false;
            if (show) {
                container.classList.add('shopping-cart-loading');
            } else {
                container.classList.remove('shopping-cart-loading');
            }
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
         * Word declension
         * @param n
         * @param textForms
         * @returns {*}
         */
        this.wordDeclension = function(n, textForms) {
            if (textForms.length === 1) {
                return textForms[0];
            }
            if (textForms.length < 3) {
                textForms.push(textForms[1]);
            }
            n = Math.abs(n) % 100; var n1 = n % 10;
            if (n > 10 && n < 20) { return textForms[2]; }
            if (n1 > 1 && n1 < 5) { return textForms[1]; }
            if (n1 === 1) { return textForms[0]; }
            return textForms[2];
        };

        /**
         * Number format for price
         * @param n
         */
        this.numFormat = function(n){
            return this.number_format(n, (Math.floor(n)===n ? 0 : 2), '.', ' ');
        };

        /**
         * Uppercase first letter
         * @param string
         * @returns {string}
         */
        this.capitalizeString = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
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

    return ShoppingCart;

}));
