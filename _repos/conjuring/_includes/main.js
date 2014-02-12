/*jslint browser: true, devel: true*/

var cta = function () {
        'use strict';

        var that = {},
            el = document.getElementById('cta'),
            hide = function () {
                el.style.display = 'none';
            };

        that.hide = hide;
        return that;
    },

    arrow = function () {
        'use strict';

        var that = {},
            el = document.getElementById('arrow'),
            hide = function () {
                el.style.display = 'none';
            };

        that.hide = hide;
        return that;
    },

    poster = function (delegate) {
        'use strict';

        var that = {},
            veraEl = document.getElementById('vera'),
            vomEl = document.getElementById('vom'),
            bottomEl = document.getElementById('bottom'),
            billingEl = document.getElementById('billing'),
            titleEl = document.getElementById('title'),
            trailerEl = document.getElementById('trailer'),

            show_vera = function () {
                veraEl.style.display = 'block';
            },

            zoom_out = function () {
                veraEl.style.width = '100%';
            },

            show_von = function () {
                vomEl.style.opacity = 1;
            },

            show_bottom = function () {
                bottomEl.style.opacity = 1;
            },

            touchstart = function () {
                delegate.did_tap(that);
            },

            show_title = function () {
                titleEl.style.opacity = 1;
                document.addEventListener('touchstart', touchstart);
            },

            show_billing = function () {
                billingEl.style.opacity = 1;
            },

            show_trailer = function () {
                veraEl.style.display = 'none';
                billingEl.style.display = 'none';
                vomEl.style.display = 'none';
                bottomEl.style.display = 'none';
                trailerEl.style.opacity = 1;
            },

            shake = function () {
                veraEl.style.webkitAnimationName = 'shake';
                veraEl.style.webkitAnimationDuration = '2s';
                veraEl.style.webkitAnimationIterationCount = 'infinite';
                veraEl.style.webkitFilter = 'blur(2px)';
            };

        that.show_trailer = show_trailer;
        that.shake = shake;
        that.show_vera = show_vera;
        that.show_von = show_von;
        that.show_bottom = show_bottom;
        that.show_billing = show_billing;
        that.show_title = show_title;
        that.zoom_out = zoom_out;
        return that;
    },

    match = function (delegate) {
        'use strict';

        var that = {},
            handLightEl = document.getElementById('hand-light'),
            handDarkEl = document.getElementById('hand-dark'),
            lighten = function () {
                handLightEl.style.opacity = 1;
            },
            zoom_out = function () {
                handDarkEl.style.display = 'none';
                handLightEl.style.opacity = 0;
                handLightEl.style.width = '67%';
                handLightEl.style.position = '-25px';
            },
            touchmove = function () {
                delegate.did_swipe_down(that);
            };


        handDarkEl.addEventListener("touchmove", touchmove);
        that.lighten = lighten;
        that.zoom_out = zoom_out;
        return that;
    },

    controller = function () {
        'use strict';

        var that = {},
            myMatch = match(that),
            myPoster = poster(that),
            myArrow = arrow(that),
            myCta = cta(that),

            go_to = function (url) {
                var a = document.createElement('a'),
                    dispatch = document.createEvent("HTMLEvents");

                a.href = url;
                a.target = '_blank';

                dispatch.initEvent('click', true, true);
                a.dispatchEvent(dispatch);
            },

            did_tap = function (view) {
                if (view === myPoster) {
                    go_to('http://yoc-ly.appspot.com/24001');
                }
            },

            end = function () {
                myPoster.show_trailer();
            },

            did_swipe_down = function (view) {
                if (view === myMatch) {
                    myMatch.lighten();
                    myPoster.show_vera();
                    myPoster.show_von();
                    myPoster.show_bottom();
                    myPoster.show_billing();
                    myPoster.show_title();
                    myArrow.hide();
                    myCta.hide();
                    setTimeout(function () {
                        myMatch.zoom_out();
                        myPoster.zoom_out();
                    }, 1500);
                    setTimeout(function () {
                        myMatch.zoom_out();
                        myPoster.shake();
                    }, 5000);
                    setTimeout(function () {
                        end();
                    }, 7000);
                }
            };

        that.did_tap = did_tap;
        that.did_swipe_down = did_swipe_down;

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

    controller();
});
