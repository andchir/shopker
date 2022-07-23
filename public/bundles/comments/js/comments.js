/**
 * ShkComments
 * @version 1.0.0
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
        window.ShkComments = factory();
    }

}(function( ){

    'use strict';

    /**
     * class ShkComments
     * @param options
     * @constructor
     */
    function ShkComments (options) {
        const self = this;
        let isInitialized = false, mainOptions = {}, container;

        const defaultOptions = {
            baseUrl: '/',
            currentUrl: '',
            threadId: 0,
            selector: '#shk-comments',
            loadingClass: 'loading',
            replyFormContainerSelector: '.comment-reply-form-container',
            replyContainerSelector: '.comment-reply-container',
            onAddSuccess: function(data) {
                if (data.result && data.result.status === 'published') {
                    self.getThreadHtml();
                } else if (data.form) {
                    container.querySelector('form').outerHTML = data.form;
                    self.formSubmitInit();
                }
            },
            onAddFail: function(data) {
                if (data.form) {
                    container.querySelector('form').outerHTML = data.form;
                    self.formSubmitInit();
                } else if (data.error) {
                    alert(data.error);
                }
            }
        };

        Object.assign(mainOptions, defaultOptions, options);

        this.init = function() {
            container = document.querySelector(mainOptions.selector);
            if (!container) {
                return;
            }
            this.getThreadHtml();
            isInitialized = true;
        };

        /**
         * Get comments thread HTML
         * @param {function} callbackFunc
         */
        this.getThreadHtml = function(callbackFunc) {
            self.showLoading(true);
            const url = mainOptions.baseUrl + '/' + mainOptions.threadId;
            this.ajax(url, {currentUrl: mainOptions.currentUrl}, function(res) {
                container.innerHTML = res;
                self.formSubmitInit();
                self.commentsActionInit();
                self.showLoading(false);
                if (typeof callbackFunc === 'function') {
                    callbackFunc();
                }
            }, function() {
                self.showLoading(false);
            });
        };

        /**
         * Get container element
         * @returns {HTMLElement}
         */
        this.getContainer = function() {
            return container;
        };

        /**
         * Form submit initialize
         */
        this.formSubmitInit = function() {
            if (!container) {
                return;
            }
            const formEl = container.querySelector('form');
            if (!formEl) {
                return;
            }
            formEl.addEventListener('submit', this.onFormSubmit.bind(this));
        };

        /**
         * Comments buttons initialize
         */
        this.commentsActionInit = function() {
            if (!document.getElementById('comments-list')) {
                return;
            }
            let actionValue = '', itemId = '';

            const forms = document.getElementById('comments-list').querySelectorAll('form');
            Array.from(forms).forEach(function(formEl) {

                // Action buttons
                const buttons = formEl.querySelectorAll('button[type="submit"]');
                Array.from(buttons).forEach(function(buttonEl) {
                    buttonEl.addEventListener('click', function(e) {
                        actionValue = e.target.value;
                        itemId = e.target.dataset.id;
                    });
                });

                // Reply button
                const buttonReplyEls = formEl.querySelectorAll('button[name="reply_toggle"]');
                if (buttonReplyEls.length > 0) {
                    Array.from(buttonReplyEls).forEach(function(buttonReplyEl) {
                        buttonReplyEl.addEventListener('click', function(e) {
                            e.preventDefault();
                            const isVisible = formEl.querySelector(mainOptions.replyFormContainerSelector).style.display !== 'none';
                            formEl.querySelector(mainOptions.replyFormContainerSelector).style.display = isVisible ? 'none' : 'block';
                            if (formEl.parentNode.querySelector(mainOptions.replyContainerSelector)) {
                                formEl.parentNode.querySelector(mainOptions.replyContainerSelector).style.display = isVisible ? 'block' : 'none';
                            }
                        });
                    });
                }

                // Form submit
                formEl.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (actionValue === 'delete') {
                        self.ajaxDelete(mainOptions.baseUrl + '/' + itemId, function() {
                            self.getThreadHtml();
                        });
                        return;
                    }
                    const data = {};
                    if (['hide', 'publish'].indexOf(actionValue) > -1) {
                        data.status = actionValue === 'publish' ? 'published' : 'pending';
                    }
                    if (actionValue === 'reply') {
                        data.reply = formEl.reply.value;
                    }
                    self.ajaxPatch(mainOptions.baseUrl + '/' + itemId, data, function() {
                        self.getThreadHtml();
                    });
                });
            });
        };

        /**
         * On form submit
         * @param e
         */
        this.onFormSubmit = function(e) {
            e.preventDefault();

            const url = mainOptions.baseUrl + '/add';
            const formData = new FormData(e.target);
            const buttonEl = container.querySelector('button[type="submit"]');
            if (buttonEl) {
                buttonEl.disabled = true;
            }

            self.showLoading(true);
            this.ajax(url, formData, function(res) {
                self.showLoading(false);
                mainOptions.onAddSuccess(res);
                if (buttonEl) {
                    buttonEl.disabled = false;
                }
            }, function(err) {
                self.showLoading(false);
                mainOptions.onAddFail(err);
                if (buttonEl) {
                    buttonEl.disabled = false;
                }
            }, 'POST');
        };

        /**
         * Show loading animation
         * @param {boolean} show
         */
        this.showLoading = function(show) {
            if (!container) {
                return;
            }
            show = show || false;
            if (show) {
                container.classList.add(mainOptions.loadingClass);
            } else {
                container.classList.remove(mainOptions.loadingClass);
            }
        };

        /**
         * Delete request
         * @param {string} actionUrl
         * @param {function} callbackFunc
         */
        this.ajaxDelete = function(actionUrl, callbackFunc) {
            self.showLoading(true);
            self.ajax(actionUrl, {}, function (res) {
                if (typeof callbackFunc === 'function') {
                    callbackFunc(res);
                }
            }, function(err) {
                if (err.error) {
                    alert(err.error);
                }
                self.showLoading(false);
            }, 'DELETE');
        };

        /**
         * Patch request
         * @param {string} actionUrl
         * @param {object} data
         * @param {function} callbackFunc
         */
        this.ajaxPatch = function(actionUrl, data, callbackFunc) {
            self.showLoading(true);
            self.ajax(actionUrl, data, function (res) {
                if (typeof callbackFunc === 'function') {
                    callbackFunc(res);
                }
            }, function(err) {
                if (err.error) {
                    alert(err.error);
                }
                self.showLoading(false);
            }, 'PATCH');
        };

        /**
         * Ajax request
         * @param {string} url
         * @param {object} data
         * @param {function} successFn
         * @param {function} failFn
         * @param {string} method
         */
        this.ajax = function(url, data, successFn, failFn, method) {
            method = method || 'GET';
            const xhr = new XMLHttpRequest();
            if (method === 'GET' && Object.keys(data).length > 0) {
                url += (url.indexOf('?') > -1 ? '&' : '?') + this.objectToUrlParams(data);
            }
            xhr.open(method, url, true);

            xhr.onload = function() {
                const result = ['{','['].indexOf(xhr.responseText.substr(0,1)) > -1
                    ? JSON.parse(xhr.responseText)
                    : xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 400) {
                    if (typeof successFn === 'function') {
                        successFn(result);
                    }
                } else {
                    if (typeof failFn === 'function') {
                        failFn(result);
                    }
                }
            };

            xhr.onerror = function() {
                if (typeof failFn === 'function') {
                    failFn(xhr);
                }
            };

            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (!(data instanceof FormData)) {
                // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            }
            if (['POST', 'PATCH', 'PUT'].indexOf(method) > -1) {
                if (data instanceof FormData) {
                    xhr.send(data);
                } else {
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    xhr.send(JSON.stringify(data));
                }
            } else {
                xhr.send();
            }
        };

        this.objectToUrlParams = function(data) {
            return Object.keys(data).map(function(key) {
                return key + '=' + encodeURIComponent(data[key]);
            }).join('&');
        };

        /**
         * Run callback after DOM ready
         * @param cb
         */
        this.onReady = function(cb) {
            if (document.readyState !== 'loading') {
                cb();
            } else {
                document.addEventListener('DOMContentLoaded', cb);
            }
        };

        this.onReady(this.init.bind(this));
    }

    return ShkComments;
}));
