/*jslint browser: true, devel: true*/

var CUBE = {};

CUBE.view = function(spec) {
    'use strict';

    var ROTATE_X = [90, 0, 0, 0, 0, -90],
        ROTATE_Y = [0, 0, 90, 180, -90, -360],

        that = {},
        el = document.createElement('div'),
        lastX = 0,
        prevRotateY = 0,
        timeB = new Date().getTime(),
        timeA = timeB,
        isRotatingRight = true,
        lastAnimationLabel = '',
        resume,

        get_matrix_3d = function () {
            var style = window.getComputedStyle(el, null),
                matrix3d = style.getPropertyValue('-webkit-transform');

            matrix3d = matrix3d.replace(/^\w*\(/, '').replace(')', '');
            return matrix3d.split(/\s*,\s*/);
        },

        get_rotate_y = function () {
            var a = get_matrix_3d()[0],
                b = get_matrix_3d()[2],
                c;

            c = Math.acos(a) * 180 / Math.PI;

            if (b > 0) {
                c = 360 - c;
            }

            return c;
        },

        get_side_el = function (i) {
            var el = spec.datasource.el_for_side(i),
                z = spec.datasource.side_length() / 2;

            el.style.position = 'absolute';
            el.style.width = spec.datasource.side_length() + 'px';
            el.style.height = spec.datasource.side_length() + 'px';
            el.style.opacity = spec.datasource.opacity_for_side(i);
            el.style.webkitTransform = 'rotateX(' + ROTATE_X[i] + 'deg) rotateY(' + ROTATE_Y[i] + 'deg) translateZ(' + z + 'px)';
            el.dataset.side = i;
            el.addEventListener('load', spec.delegate.did_load_side(i));
            return el;
        },

        get_animation_label = function () {
            return 'rotate-' + new Date().getTime();
        },

        add_style_rule = function (rule) {
            if (document.styleSheets && document.styleSheets.length > 0) {
                document.styleSheets[0].insertRule(rule, document.styleSheets.length - 1);
            } else {
                var styleEl = document.createElement('style');
                styleEl.innerHTML = rule;
                document.getElementsByTagName('head')[0].appendChild(styleEl);
            }
        },

        get_rotation_directive = function () {
            return lastAnimationLabel + ' ' + spec.datasource.rotation_period() + ' infinite linear';
        },

        set_automatic_rotation = function (startY) {
            startY = startY || 0;

            var endY = isRotatingRight ? startY + 359 : startY - 361,
                animationLabel = get_animation_label();

            add_style_rule('@-webkit-keyframes ' + animationLabel + ' {from {-webkit-transform: rotateY(' + startY + 'deg);} to {-webkit-transform: rotateY(' + endY + 'deg);}}');
            lastAnimationLabel = animationLabel;
            el.style.webkitAnimation = get_rotation_directive();
            el.style.webkitAnimationName = lastAnimationLabel + ' !important';
            el.style.webkitAnimationPlayState = 'running';
        },

        rotate = function(startY) {
            el.style.webkitTransition = '-webkit-transform 1ms linear';
            el.style.webkitAnimation = '';
            el.style.webkitTransform = 'rotateY(' + startY + 'deg)';
        },

        touch_did_move = function (event) {
            var x = event.touches[0].clientX,
                d = x - lastX,
                currentRotateY = get_rotate_y();

            timeA = timeB;
            timeB = new Date().getTime();
            lastX = x;

            rotate(currentRotateY + d);
            prevRotateY = get_rotate_y() - d;
        },

        touch_did_stop = function () {
            var dist = get_rotate_y() - prevRotateY,
                time = timeB - timeA,
                speed = time !== 0 ? dist / time : 0,
                transitionPeriod,
                rotation;

            if (Math.abs(speed) < 0.01) {
                spec.delegate.did_click_on_side(event.target.dataset.side);
                return;
            }

            el.removeEventListener('touchmove', touch_did_move);
            el.removeEventListener('touchend', touch_did_stop);

            isRotatingRight = speed > 0;

            transitionPeriod = 100 * Math.abs(speed);
            rotation = speed * 80 + get_rotate_y();
            el.style.webkitTransition = '-webkit-transform ' + transitionPeriod + 'ms ease-out';
            el.style.webkitTransform = 'rotateY(' + rotation + 'deg)';
            lastX = 0;

            setTimeout(function () {
                el.style.webkitTransition = '';
                resume(get_rotate_y());
            }, transitionPeriod);
        },

        touch_did_start = function (event) {
            lastX = event.touches[0].clientX;
            el.style.webkitTransform = 'rotateY(' + get_rotate_y() + 'deg)';
            el.style.webkitAnimationName = 'none !important';
            el.style.webkitAnimationPlayState = 'paused';
            prevRotateY = get_rotate_y();

            el.addEventListener('touchmove', touch_did_move);
            el.addEventListener('touchend', touch_did_stop);
            el.removeEventListener('touchstart', touch_did_start);
        },

        get_cube_el = function () {
            if (el.id) {
                return el;
            }

            var i;

            el.id = 'cube';
            el.style.height = spec.datasource.side_length() + 'px';
            el.style.width = spec.datasource.side_length() + 'px';
            el.style.position = 'relative';
            el.style.margin = '0 auto';
            el.style.webkitTransformStyle = 'preserve-3d';
            el.addEventListener('touchstart', touch_did_start);

            for (i = 0; i < 6; i = i + 1) {
                el.appendChild(get_side_el(i));
            }

            return el;
        },

        get_background_image_el = function () {
            var url = spec.datasource.image_url_for_background(),
                el;

            if (!url) {
                return;
            }

            el = document.createElement('img');
            el.src = spec.datasource.image_url_for_background();
            el.style.width = '100%';
            el.style.height = 'auto';
            el.style.position = 'absolute';
            el.style.opacity = spec.datasource.opacity_for_background();

            return el;
        },

        center = function () {
            el.style.paddingTop = window.innerHeight / 2 - spec.datasource.side_length() / 2 + 'px';
        },

        close = function (event) {
            var container = event.target.parentNode;
            container.parentNode.removeChild(container);
        },

        append = function (parent) {
            if (!parent) {
                parent = document.body;
            }

            if (spec.datasource.image_url_for_background()) {
                parent.appendChild(get_background_image_el());
            }

            var container = document.createElement('div'),
                closeEl;

            parent.style.overflow = 'hidden';
            container.id = 'container';
            container.style.webkitPerspective = '800';
            container.style.webkitPerspectiveOrigin = '50% 50px';
            container.style.webkitTransform = 'scale(0.75,0.75)';

            container.appendChild(get_cube_el());
            parent.appendChild(container);

            center();

            window.addEventListener('resize', function () {
                center();
            });

            closeEl = spec.datasource.el_for_close_button();
            if (closeEl) {
                closeEl.addEventListener('touchstart', close);
                parent.appendChild(closeEl);
            }
        };

    resume = function (startY) {
        el.style.webkitTransition = '';
        set_automatic_rotation(startY);
        el.addEventListener('touchstart', touch_did_start);
    };

    that.append = append;
    that.get_cube_el = get_cube_el;
    that.resume = resume;

    return that;
};

CUBE.controller = function (spec) {
    'use strict';

    var that = {},
        loadedSides = 0,
        cubeView = CUBE.view({
            datasource: that,
            delegate: that
        }),

        side_length = function () {
            if (!spec.sideLength) {
                return 250;
            }

            if (typeof spec.sideLength !== 'number') {
                throw {
                    name: 'TypeError',
                    message: 'sideLength must be a number'
                };
            }

            return spec.sideLength;
        },

        rotation_period = function () {
            if (!spec.rotationPeriod) {
                return '10s';
            }

            if (typeof spec.rotationPeriod !== 'string') {
                throw {
                    name: 'TypeError',
                    message: 'rotationPeriod must be a string'
                };
            }

            return spec.rotationPeriod;
        },

        image_url_for_side = function (i) {
            if (!spec.imageURLs || !spec.imageURLs[i]) {
                return 'http://placehold.it/500x500';
            }

            if (typeof spec.imageURLs[i] !== 'string') {
                throw {
                    name: 'TypeError',
                    message: 'imageURLs[' + i + '] must be a string'
                };
            }

            return spec.imageURLs[i];
        },

        background_color_for_side = function (i) {
            if (!spec.backgroundColors || !spec.backgroundColors[i]) {
                return 'black';
            }

            if (typeof spec.backgroundColors[i] !== 'string') {
                throw {
                    name: 'TypeError',
                    message: 'spec.backgroundColors[' + i + '] must be a string'
                };
            }

            return spec.backgroundColors[i];
        },

        el_for_side = function (i) {
            var el = document.createElement('div');
            el.style.backgroundImage = 'url(' + image_url_for_side(i) + ')';
            el.style.backgroundSize = '100%';
            el.style.backgroundColor = background_color_for_side(i);
            return el;
        },

        el_for_close_button = function () {
            if (!spec.showCloseButton) {
                return;
            }

            var el = document.createElement('img');
            el.style.position = 'absolute';
            el.style.top = '10px';
            el.style.left = '10px';
            el.style.width = '22px';
            el.src = 'close.png';
            return el;
        },

        open_url = function (url) {
            var a = document.createElement('a'),
                dispatch = document.createEvent('HTMLEvents');

            a.href = url;
            a.target = '_blank';

            dispatch.initEvent('click', true, true);
            a.dispatchEvent(dispatch);
        },

        did_click_on_side = function (i) {
            if (!spec.destURLs[i]) {
                return;
            }

            if (typeof spec.destURLs[i] !== 'string') {
                throw {
                    name: 'TypeError',
                    message: 'spec.destURLs[' + i + '] must be a string'
                };
            }

            open_url(spec.destURLs[i]);
        },

        did_load_side = function () {
            loadedSides = loadedSides + 1;
            if (loadedSides === 5) {
                cubeView.resume(0);
            }
        },

        image_url_for_background = function () {
            if (spec.backgroundImageURL && typeof spec.backgroundImageURL !== 'string') {
                throw {
                    name: 'TypeError',
                    message: 'backgroundImageURL must be a string'
                };
            }

            return spec.backgroundImageURL;
        },

        opacity_for_background = function () {
            if (spec.backgroundImageOpacity && typeof spec.backgroundImageOpacity !== 'number') {
                throw {
                    name: 'TypeError',
                    message: 'backgroundImageOpacity must be a number'
                };
            }

            return spec.backgroundImageOpacity || 1;
        },

        opacity_for_side = function () {
            if (spec.sideOpacity && typeof spec.sideOpacity !== 'number') {
                throw {
                    name: 'TypeError',
                    message: 'sideOpacity must be a number'
                };
            }
            return spec.sideOpacity || 1;
        },

        load_tracking_pixel = function () {
            if (!spec.trackingPixelURL) {
                return;
            }

            var el = document.createElement('img');
            el.src = spec.trackingPixelURL;
            el.style.display = 'none';
            document.body.appendChild(el);
        },

        start = function () {
            window.addEventListener('touchstart', function (event) {
                event.preventDefault();
            });

            cubeView.append(document.body);
            load_tracking_pixel();
        };

    spec = spec || {};

    that.side_length = side_length;
    that.start = start;
    that.el_for_side = el_for_side;
    that.el_for_close_button = el_for_close_button;
    that.rotation_period = rotation_period;
    that.did_click_on_side = did_click_on_side;
    that.did_load_side = did_load_side;
    that.image_url_for_background = image_url_for_background;
    that.opacity_for_background = opacity_for_background;
    that.opacity_for_side = opacity_for_side;

    return that;
};