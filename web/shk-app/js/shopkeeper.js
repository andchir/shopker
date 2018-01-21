
/**
 * Shopkeeper
 * @version 1.0.0alpha
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


};
