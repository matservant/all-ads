/*jslint browser: true, devel: true*/

var train = function () {
        'use strict';
        var that = {},
            el = document.getElementById('train'),
            move = function () {
                el.style.left = '-1000px';
            };
        that.move = move;
        return that;
    },
    cta = function () {
        'use strict';
        var that = {},
            el = document.getElementById('cta'),
            show = function () {
                el.style.opacity = 1;
            };
        that.show = show;
        return that;
    },
    ad = function () {
        'use strict';
        var that = {},
            el = document.getElementById('container'),
            open_landing_page = function () {
                window.open('http://www.bahn.de');
            },
            init = function () {
                var myTrain = train(),
                    myCTA = cta();
                myTrain.move();
                el.addEventListener('touchstart', open_landing_page);
                setTimeout(myCTA.show, 5000);
            };
        that.init = init;
        return that;
    };

window.addEventListener('load', function () {
    'use strict';
    var myAd = ad();
    myAd.init();
});