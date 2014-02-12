/*jslint browser: true*/

var view = function (spec) {
        'use strict';
        var that = {},
            delegate = spec.delegate || window,
            el = document.getElementById(spec.id),

            touchstart = function () {
                if (delegate.hasOwnProperty('did_tap_view')) {
                    delegate.did_tap_view(that);
                }
            },

            touchmove = function () {
                if (delegate.hasOwnProperty('did_move_view')) {
                    delegate.did_move_view(that);
                }
            },

            touchend = function () {
                if (delegate.hasOwnProperty('did_release_view')) {
                    delegate.did_release_view(that);
                }
            };

        el.addEventListener('touchstart', touchstart);
        el.addEventListener('touchmove', touchmove);
        el.addEventListener('touchstop', touchend);

        that.el = el;
        return that;
    },

    cubeView = function(spec) {
        'use strict';

        var ROTATE_X = [90, 0, 0, 0, 0, -90],
            ROTATE_Y = [0, 0, 90, 180, -90, -360],
            // BANNERS = ['img/baeren.png', 'img/houston.png'],

            that = {},
            el = document.createElement('div'),
            lastX = 0,
            prevRotateY = 0,
            timeB = new Date().getTime(),
            timeA = timeB,
            resume,

            set_banner = function () {
                console.log('set_banner');
            },

            blur = function () {
                // banner_els[0].style.webkitFilter = 'blur(40px)';
                // banner_els[1].style.webkitFilter = 'blur(40px)';
                set_banner();
            },

            next = function () {
                blur();
                console.log('next');
            },

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
                    z = spec.datasource.side_length() / 2 + 30;

                el.style.position = 'absolute';
                el.style.width = '50%';
                el.style.height = '100%';
                el.style.opacity = spec.datasource.opacity_for_side(i);
                el.style.webkitTransform = 'rotateX(' + ROTATE_X[i] + 'deg) rotateY(' + ROTATE_Y[i] + 'deg) translateZ(' + z + 'px)';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.webkitBackfaceVisibility = 'hidden';
                el.dataset.side = i;
                el.addEventListener('load', spec.delegate.did_load_side(i));
                return el;
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

            lastDeg = 0,

            touch_did_stop = function () {
                var dist = get_rotate_y() - prevRotateY,
                    time = timeB - timeA,
                    speed = time !== 0 ? dist / time : 0,
                    transitionPeriod;

                // if (Math.abs(speed) < 0.01) {
                //     spec.delegate.did_click_on_side(event.target.dataset.side);
                //     return;
                // }

                console.log(transitionPeriod);

                el.removeEventListener('touchmove', touch_did_move);
                el.removeEventListener('touchend', touch_did_stop);

                transitionPeriod = 100 * Math.abs(speed);
                el.style.webkitTransition = '-webkit-transform 0.75s ease-out';
                lastDeg = lastDeg + 360;
                el.style.webkitTransform = 'rotateY(' + lastDeg + 'deg)';
                lastX = 0;
                next();
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
                el.style.width = '100%';
                el.style.position = 'absolute';
                el.style.top = 0;
                el.style.margin = '0 -65px';
                el.style.webkitTransformStyle = 'preserve-3d';
                el.addEventListener('touchstart', touch_did_start);

                for (i = 0; i < 6; i = i + 1) {
                    el.appendChild(get_side_el(i));
                }

                return el;
            },

            center = function () {
                el.style.paddingTop = '16%';
                el.style.paddingLeft = '40%';
            },

            close = function (event) {
                var container = event.target.parentNode;
                container.parentNode.removeChild(container);
            },

            append = function (parent) {
                if (!parent) {
                    parent = document.body;
                }

                var container = document.getElementById('container'),
                    closeEl;

                container.appendChild(get_cube_el());
                parent.appendChild(container);

                window.addEventListener('resize', function () {
                    center();
                });

                closeEl = spec.datasource.el_for_close_button();
                if (closeEl) {
                    closeEl.addEventListener('touchstart', close);
                    parent.appendChild(closeEl);
                }
            };

        resume = function () {
            el.style.webkitTransition = '';
            el.addEventListener('touchstart', touch_did_start);
        };

        that.append = append;
        that.get_cube_el = get_cube_el;
        that.resume = resume;
        that.center = center;
        that.rotate = rotate;
        that.touch_did_stop = touch_did_stop;

        return that;
    },

    cubeController = function (spec) {
        'use strict';

        var that = {},
            loadedSides = 0,
            myCubeView = cubeView({
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
                    return '';
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
                    return '';
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
                el.style.backgroundSize = '50%';
                el.style.backgroundPosition = '40% 16%';
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

            did_load_side = function () {
                loadedSides = loadedSides + 1;
                if (loadedSides === 5) {
                    myCubeView.resume(0);
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

                myCubeView.append(document.body);
                load_tracking_pixel();
            };

        spec = spec || {};

        that.side_length = side_length;
        that.start = start;
        that.el_for_side = el_for_side;
        that.el_for_close_button = el_for_close_button;
        that.rotation_period = rotation_period;
        that.did_load_side = did_load_side;
        that.image_url_for_background = image_url_for_background;
        that.opacity_for_background = opacity_for_background;
        that.opacity_for_side = opacity_for_side;
        that.cubeView = myCubeView;

        return that;
    },

    bottleCubeView = function(spec) {
        'use strict';

        var ROTATE_X = [90, 0, 0, 0, 0, -90],
            ROTATE_Y = [0, 0, 90, 180, -90, -360],

            that = {},
            el = document.createElement('div'),
            lastX = 0,
            prevRotateY = 0,
            timeB = new Date().getTime(),
            timeA = timeB,
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

                return 0;
            },

            get_side_el = function (i) {
                var el = spec.datasource.el_for_side(i),
                    z = spec.datasource.side_length() / 2 + 30;

                el.style.position = 'absolute';
                el.style.width = '50%';
                el.style.height = '90%';
                el.style.opacity = spec.datasource.opacity_for_side(i);
                el.style.webkitTransform = 'rotateX(' + ROTATE_X[i] + 'deg) rotateY(' + ROTATE_Y[i] + 'deg) translateZ(' + z + 'px)';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.webkitBackfaceVisibility = 'hidden';
                el.dataset.side = i;
                el.addEventListener('load', spec.delegate.did_load_side(i));
                return el;
            },

            rotate = function(startY) {
                el.style.webkitTransition = '-webkit-transform 1s ease-out';
                el.style.webkitTransform = 'rotateZ(-50deg) rotateY(' + startY + 'deg)';
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
                    transitionPeriod;

                if (Math.abs(speed) < 0.01) {
                    spec.delegate.did_click_on_side(event.target.dataset.side);
                    return;
                }

                el.removeEventListener('touchmove', touch_did_move);
                el.removeEventListener('touchend', touch_did_stop);

                transitionPeriod = 300 * Math.abs(speed);
                el.style.webkitTransition = '-webkit-transform 1s ease-out';
                el.style.webkitTransform = 'rotateZ(-50deg) rotateY(360deg)';
                lastX = 0;

                setTimeout(function () {
                    el.style.webkitTransition = '';
                    resume(get_rotate_y());
                }, transitionPeriod + 1000);

                window.touch_did_stop();
            },

            touch_did_start = function (event) {
                lastX = event.touches[0].clientX;
                el.style.webkitTransform = 'rotateZ(-50deg) rotateY(0deg)';
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

                el.id = 'bottle-cube';
                el.style.height = spec.datasource.side_length() + 'px';
                el.style.width = '100%';
                el.style.position = 'absolute';
                el.style.top = 0;
                el.style.margin = '0 -60px';
                el.style.webkitTransform = 'rotateZ(-50deg) rotateY(0deg)';
                el.style.webkitTransformStyle = 'preserve-3d';
                el.addEventListener('touchstart', touch_did_start);

                for (i = 0; i < 6; i = i + 1) {
                    el.appendChild(get_side_el(i));
                }

                return el;
            },

            center = function () {
                el.style.paddingTop = '10%';
                el.style.paddingLeft = '28%';
            },

            close = function (event) {
                var container = event.target.parentNode;
                container.parentNode.removeChild(container);
            },

            append = function (parent) {
                if (!parent) {
                    parent = document.body;
                }

                var container = document.getElementById('container'),
                    closeEl;

                container.appendChild(get_cube_el());
                parent.appendChild(container);

                window.addEventListener('resize', function () {
                    center();
                });

                closeEl = spec.datasource.el_for_close_button();
                if (closeEl) {
                    closeEl.addEventListener('touchstart', close);
                    parent.appendChild(closeEl);
                }
            };

        resume = function () {
            el.style.webkitTransition = '';
            el.addEventListener('touchstart', touch_did_start);
        };

        that.append = append;
        that.get_cube_el = get_cube_el;
        that.resume = resume;
        that.center = center;
        that.rotate = rotate;

        return that;
    },

    bottleCubeController = function (spec) {
        'use strict';

        var that = {},
            loadedSides = 0,
            myCubeView = bottleCubeView({
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
                    return '';
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
                    return '';
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
                el.style.backgroundSize = '90%';
                el.style.backgroundPosition = '20% 100%';
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
            },

            did_load_side = function () {
                loadedSides = loadedSides + 1;
                if (loadedSides === 5) {
                    myCubeView.resume(0);
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

                myCubeView.append(document.body);
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
        that.cubeView = myCubeView;

        return that;
    },

    banner = function (spec) {
        'use strict';
        var that = view(spec),
            current = 0,
            children = [
                document.getElementById('legendary'),
                document.getElementById('houston'),
                document.getElementById('baeren')
            ],
            next = function () {
                if (current < children.length) {
                    children[current].style.opacity = 0;
                    children[current].style.webkitFilter = 'blur(40px)';
                    current = (current + 1) % 3;
                    children[current].style.opacity = 1;
                    children[current].style.webkitFilter = 'blur(0)';
                }
            };

        that.next = next;
        return that;
    },

    cta = function (spec) {
        'use strict';
        var that = view(spec);
        return that;
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

    position_heineken_logo = function () {
        'use strict';
        var heineken = document.getElementById('heineken');
        heineken.style.top = (window.pageYOffset + window.innerHeight - heineken.clientHeight) + 'px';
    },

    ad = function () {
        'use strict';
        var that = {},
            myCta = cta({delegate: that, id: 'gewinne-container'}),
            myCubeController,
            myBottleCubeController,
            reappend,

            did_tap_view = function (view) {
                switch (view) {
                case myCta:
                    switch (window.location.pathname) {
                    case "/heineken/am.html":
                        go_to('http://de.vice.com/1bhi9Ou');
                        break;
                    case "/heineken/gj.html":
                        go_to('http://bit.ly/14odtEy');
                        break;
                    default:
                        go_to('//yoc-ly.appspot.com/28001?yoc_campaign=heinekenvoyage');
                    }
                    break;
                default:
                    console.log('touch started on', event.target);
                }
            };

        document.getElementById('earth-container').style.webkitTransform = 'scale(1)';
        document.getElementById('heineken-2').style.webkitTransform = 'scale(0.8) translateY(-4px) translateX(2px)';
        document.getElementById('heineken-2').style.opacity = 0;
        setTimeout(function() {
            reappend = document.getElementById('gewinne-container');
            document.body.appendChild(reappend);
            document.getElementById('gewinne-container').style.opacity = 0;
            document.getElementById('container').style.opacity = 1;
            document.getElementById('earth').style.webkitFilter = 'brightness(0)';
        }, 100);

        setTimeout(function() {
            document.getElementById('gewinne-container').style.opacity = 1;
        }, 200);

        try {
            myCubeController = cubeController({
                imageURLs: [
                    '',
                    'img/legendary.png',
                    '',
                    'img/legendary.png',
                    '',
                    ''
                ],
                sideLength: 150,
                rotationPeriod: '10s',
                backgroundImageOpacity: 0.7,
                sideOpacity: 0.9,
                delegate: that
            });

            myCubeController.start();
            myCubeController.cubeView.center();

            myBottleCubeController = bottleCubeController({
                imageURLs: [
                    '',
                    'img/bottle-horizontal-fs8.png',
                    '',
                    '',
                    '',
                    ''
                ],
                sideLength: 250,
                rotationPeriod: '10s',
                backgroundImageOpacity: 0.7,
                sideOpacity: 0.9,
                delegate: that
            });

            myBottleCubeController.start();
            myBottleCubeController.cubeView.center();
        } catch (e) {
            console.log(e.name + ': ' + e.message);
        }

        that.myCubeController = myCubeController;
        that.myBottleCubeController = myBottleCubeController;
        that.did_tap_view = did_tap_view;
        return that;
    },

    current = 0;

window.touch_did_stop = function () {
    'use strict';
    console.log(window.myAd.myCubeController.cubeView);
    var imgs = ['img/legendary-fs8.png', 'img/baeren-fs8.png', 'img/houston-fs8.png', 'img/radtour-fs8.png', 'img/legendary-fs8.png', 'img/flugsafari-fs8.png', 'img/campertrip-fs8.png'];
    window.myAd.myCubeController.cubeView.touch_did_stop();
    if (current === imgs.length - 1) {
        current = 0;
    } else {
        current = current + 1;
    }
    document.getElementById('cube').children[1].style.backgroundImage = 'url(' + imgs[current] + ')';
    document.getElementById('cube').children[3].style.backgroundImage = 'url(' + imgs[current] + ')';
};

window.addEventListener('orientationchange', function () {
    'use strict';
    position_heineken_logo();
});

window.addEventListener("load", function () {
    'use strict';

    setTimeout(function () {
        window.scrollTo(0, 1);
        position_heineken_logo();
    }, 100);

    window.addEventListener("touchstart", function (event) {
        event.preventDefault();
    });

    window.myAd = ad();
});
