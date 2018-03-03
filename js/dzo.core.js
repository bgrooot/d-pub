//dzo.core.js
var dzo;

(function(window) {

    var dzo = function(selector) {

        return new dzo.fn.init(selector);
    };

    dzo.fn = dzo.prototype = {

        init: function(selector) {

            var selectorType = typeof selector;

            switch (selectorType) {

                //element
                case 'object':
                    this.element = selector;
                    break;

                //id
                case 'string':
                    this.element = document.getElementById(selector);
                    break;
            }

            return this;
        }
    };

    //jsonp function
    window.dzo_json = function(bind, json) {   

        var event = jQuery.Event(bind + 'LoadComplate');

        event.json = json;       
        $(document).trigger(event);
    };            

    //dzo utility
    //qeuryString to object
    dzo.deparam = function(url) {

        var str = url || document.URL,
            queryStr = str.split('?')[1],
            queryObj = {}, queryArr = [], paramArr = [], queryLen;

        if (!queryStr)
            return queryObj;
            
        queryArr = queryStr.split('&');
        queryLen = queryArr.length;       

        for (var i=0; i<queryLen; i++) {

            paramArr = queryArr[i].split('=');
            queryObj[ paramArr[0] ] = paramArr[1];
        }

        return queryObj;
    };

    dzo.cookie = {

        setCookie: function(param) {

            var key, cookieStr = '';

            for (key in param)         
                cookieStr += key + '=' + param[key] + '; ';

            document.cookie = cookieStr;
        },

        getCookie: function(name) {

            var cookie = document.cookie,
                startIdx = cookie.indexOf(name),
                endIdx;

            if (startIdx < 0)
                return;

            startIdx++; 
            endIdx = cookie.indexOf('; ', startIdx);
            startIdx += name.length;

            if (endIdx < 0)
                endIdx = cookie.length;

            return cookie.substring(startIdx, endIdx);
        }
    };

    dzo.font = {

        init: function() {

            $(document).ready(function() { dzo.font.sizeChange(); });
        }(),

        fontArr: [0.9375, 1, 1.125, 1.25, 1.375, 1.5, 1.75],
        LineHeightArr: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],

        fontIndex: function() {

            return dzo.cookie.getCookie('fontIdx') || 3;
        }(),       

        sizeChange: function(sign) {

            var cookieDate = new Date(),
                fontArrLen = this.fontArr.length,
                font, lineHeight;              

            if (sign === '+' && this.fontIndex < fontArrLen - 1) 
                this.fontIndex++;        

            else if (sign === '-' && this.fontIndex > 0)
                this.fontIndex--;

            font = this.fontArr[this.fontIndex];
            lineHeight = this.LineHeightArr[this.fontIndex];

            $('.paragraph').css({fontSize: font + 'em', lineHeight: lineHeight});
            $('.subtitle').css({fontSize: font + 'em', lineHeight: lineHeight});

            cookieDate.setDate(cookieDate.getDate() + 7);
            dzo.cookie.setCookie({

                fontIdx: this.fontIndex,
                path: '/',
                domain: 'chosun.com'
            });
        }
    };

    dzo.domain = dzo.deparam().domain || document.domain.split('.chosun.com')[0];

    // inflow route, inlink or outlink
    dzo.inflowRoute = function() {

        var inflow = document.referrer.search('chosun.com') > -1 ? "inlink" : "outlink";
        // var inflow = "inlink";

        $(document).ready(function() {

            var dispElem = $('[data-route-disp=' + inflow + ']'),
                noDispElem = $('[data-route-disp]').not(dispElem),
                routeElem = $('[data-route-disp]'),
                routeLen = routeElem.length, 
                elem; 
            
            for (var i=0; i<routeLen; i++) {

                elem = $(routeElem[i]);
                elem.addClass( elem.data('routeDisp') );
            }

            noDispElem.hide();
        });

        return inflow;
    }();

    (function() {

        var uAgent = navigator.userAgent.toLowerCase();

        dzo.isAndroid = uAgent.indexOf('android') > -1;
        dzo.isIOS = uAgent.indexOf('iphone') > -1 || uAgent.indexOf('ipad') > -1 || uAgent.indexOf('ipod') > -1;

    })();

    dzo.openPopup = function(url, width, height, scroll) {

        var left = screen.width / 2 - width / 2,
            top = screen.height / 2 - height / 2;

        window.open(url, null, 'left=' + left + ', top=' + top + ', width=' + width + ', height=' + height + ',scrollbars=' + scroll + ', toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no');
    };

    dzo.fn.init.prototype = dzo.fn;
    window.dzo = dzo;

    $.support.cors = true;

})(window);

var c = function(str) {

    console.log(str);
};