/*jslint browser: true, devel: true*/

var debug = false,
    rotationEl = document.getElementById('rotation'),
    foregroundEl = document.getElementById('foreground'),
    foregroundImageEl = document.getElementById('foreground-image'),
    backgroundImageEl = document.getElementById('background-image'),
    snowboarderEl = document.getElementById('snowboarder'),

    rectangle_can_go_back = function () {
        'use strict';
        return foregroundEl.offsetLeft > -100;
    },

    reveal_background = function () {
        'use strict';
        foregroundEl.style.left = '-320px';
    },

    snowboarder_x_for_gamma = function (gamma) {
        'use strict';

        if (gamma < -10) {
            return snowboarderEl.offsetLeft - 50;
        }
        return snowboarderEl.offsetLeft;
    },

    go_to = function (url) {
        'use strict';
        var a = document.createElement('a'),
            dispatch = document.createEvent("HTMLEvents");

        a.href = url;
        a.target = '_blank';

        dispatch.initEvent('click', true, true);
        a.dispatchEvent(dispatch);
    },

    open_landing_page = function () {
        'use strict';
        if (location.search === '?dec') {
            go_to('//yoc-ly.appspot.com/5903432548352000');
            return;
        }
        go_to('//yoc-ly.appspot.com/5838372383752192');
    },

    snowboarder_angle_for_gamma = function (gamma) {
        'use strict';
        if (gamma > 8) {
            return 8;
        }
        if (gamma < -8) {
            return -8;
        }
        return gamma;
    },

    snowboarder_y_for_offset_left = function (offsetLeft) {
        'use strict';
        return -Math.pow(offsetLeft, 3) / 27000 + (7 * Math.pow(offsetLeft, 2)) / 600 - (31 * offsetLeft) / 20 + 136;
    },

    rectangle_x_for_gamma = function (gamma) {
        'use strict';
        if (gamma > -30) {
            return;
        }
        return -320;
    },

    show_rotation_data = function (event) {
        'use strict';
        rotationEl.innerHTML = 'gamma: ' + Math.floor(event.gamma) + '<br/>rectangle is at ' + foregroundEl.offsetLeft + '<br/>moving it to ' + rectangle_x_for_gamma(event.gamma) + '<br/>can go back: ' + rectangle_can_go_back() + '<br/>snowboarderEl.offsetLeft: ' + snowboarderEl.offsetLeft + '<br/>snowboarderEl.offsetTop: ' + snowboarderEl.offsetTop;
    },

    show_background_image = function () {
        'use strict';
        backgroundImageEl.style.opacity = 1;
    },

    did_rotate_device = function (event) {
        'use strict';
        snowboarderEl.style.left = snowboarder_x_for_gamma(event.gamma) + 'px';
        snowboarderEl.style.top = snowboarder_y_for_offset_left(snowboarderEl.offsetLeft) + 'px';
        snowboarderEl.style.webkitTransform = 'rotate(' + snowboarder_angle_for_gamma(event.gamma) + 'deg)';
        if (snowboarderEl.offsetLeft < 30) {
            reveal_background();
        }
    },

    show_background_image_when_foreground_image_is_loaded = function () {
        'use strict';
        foregroundImageEl.src = 'img/entdecke.jpg';
        foregroundImageEl.addEventListener('load', show_background_image);
    };

window.addEventListener('load', function () {
    'use strict';

    window.addEventListener("deviceorientation", did_rotate_device);
    if (debug) {
        window.addEventListener("deviceorientation", show_rotation_data);
    }

    backgroundImageEl.addEventListener('touchstart', open_landing_page);
    show_background_image_when_foreground_image_is_loaded();
});