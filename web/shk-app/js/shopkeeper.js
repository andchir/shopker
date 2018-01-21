/**
 * Shopkeeper
 * @version 4.0.0alpha
 * @author Andchir<andchir@gmail.com>
 */

var Shopkeeper = function () {

    'use strict';

    var self = this;

    this.orderByChange = function(currentUrl, orderBy) {
        var qsArr = currentUrl.split(/[\?&]/),
            newUrl = qsArr.shift();
        qsArr.forEach(function(qs){
            var tmpArr = qs.split('='),
                sep = newUrl.indexOf('?') > -1 ? '&' : '?';
            if (tmpArr[0] === 'order_by') {
                newUrl += sep + 'order_by=' + orderBy;
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

};
