/*jslint browser: true, devel: true*/

var overlay = function (delegate) {
        'use strict';

        var that = {},
            el = document.getElementById('overlay'),
            touchstart = function () {
                delegate.did_tap_view(that);
            },
            show = function () {
                el.style.pointerEvents = 'auto';
                el.addEventListener('touchstart', touchstart);
                el.style.opacity = 1;
            };

        that.show = show;
        return that;
    },

    phone = function (delegate) {
        'use strict';

        var that = {},
            el = document.getElementById('phone'),
            screenEl = document.getElementById('screen'),
            offsetX = 0,
            offsetY = 0,

            hide = function () {
                el.style.display = 'none';
            },

            update_screen = function (x, y) {
                var xOffset = 10, yOffset = 30;
                screenEl.style.backgroundPosition = (-1 * x - xOffset) + 'px ' + (-1 * y - yOffset) + 'px';
            },

            move_camera = function (x, y) {
                el.style.left = x + 'px';
                el.style.top = y + 'px';
            },

            // log = function (text) {
            //     document.getElementById('log').innerHTML = text;
            // },

            touchstart = function (event) {
                // log(event.clientX);
                if (window.navigator.msPointerEnabled) {
                    offsetX = event.clientX - el.offsetLeft;
                    offsetY = event.clientY - el.offsetTop;
                } else {
                    offsetX = event.touches[0].clientX - el.offsetLeft;
                    offsetY = event.touches[0].clientY - el.offsetTop;
                }

                delegate.did_tap_view(that);
            },

            touchmove = function (event) {
                var x, y;

                if (window.navigator.msPointerEnabled) {
                    x = event.clientX - offsetY;
                    y = event.clientY - offsetX;
                } else {
                    x = event.touches[0].clientX - offsetX;
                    y = event.touches[0].clientY - offsetY;
                }

                // log(x, y);

                move_camera(x, y);
                update_screen(x, y);
                delegate.did_drag_view(that);
            },

            show = function () {

                if (window.navigator.msPointerEnabled) {
                    el.addEventListener('MSPointerDown', touchstart);
                    el.addEventListener('MSPointerMove', touchmove);
                } else {
                    el.addEventListener('touchstart', touchstart);
                    el.addEventListener('touchmove', touchmove);
                }

                el.style.display = 'block';
                screenEl.style.backgroundSize = window.innerWidth + 'px';
                update_screen(el.offsetLeft, el.offsetTop);
            };



        that.hide = hide;
        that.show = show;
        return that;
    },

    ad = function () {
        'use strict';

        var that = {},
            myPhone = phone(that),
            myOverlay = overlay(that),

            did_drag_view = function () {
                console.log('did drag it');
            },

            go_to = function (url) {
                var a = document.createElement('a'),
                    dispatch = document.createEvent("HTMLEvents");

                a.href = url;
                a.target = '_blank';

                dispatch.initEvent('click', true, true);
                a.dispatchEvent(dispatch);
            },

            did_tap_view = function (view) {
                if (view === myPhone) {
                    document.getElementById('verschiebe-container').style.height = '46px';
                    document.getElementById('verschiebe').style.opacity = 0;
                    setTimeout(function () {
                        myOverlay.show();
                    }, 3000);
                } else if (view === myOverlay) {
                    if (location.search === '?staging') {
                        go_to('camera.html');
                        return;
                    }

                    go_to('http://yoc-ly.appspot.com/5799236641751040?yoc_campaign=nokia');
                }
            },

            start = function () {
                myPhone.show();
            };

        that.did_tap_view = did_tap_view;
        that.did_drag_view = did_drag_view;
        that.start = start;
        return that;
    };

window.addEventListener("load", function () {
    'use strict';

    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 100);

    window.addEventListener("touchstart", function (event) {
        event.preventDefault();
    });

    window.addEventListener("MSPointerDown", function (event) {
        event.preventDefault();
    });

    document.getElementById('phone').style.top = (window.innerHeight * 0.7) + 'px';

    ad().start();
});
