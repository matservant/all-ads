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

            touchstart = function (event) {
                offsetX = event.touches[0].clientX - el.offsetLeft;
                offsetY = event.touches[0].clientY - el.offsetTop;
                delegate.did_tap_view(that);
            },

            touchmove = function (event) {
                var x = event.touches[0].clientX - offsetX,
                    y = event.touches[0].clientY - offsetY;

                move_camera(x, y);
                update_screen(x, y);
                delegate.did_drag_view(that);
            },

            show = function () {
                el.addEventListener('touchstart', touchstart);
                el.addEventListener('touchmove', touchmove);

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
                    setTimeout(function () {
                        myOverlay.show();
                    }, 3000);
                } else if (view === myOverlay) {
                    go_to('http://yoc-ly.appspot.com/25001?yoc_campaign=nl925');
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

    ad().start();
});
