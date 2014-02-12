/*jslint browser: true, devel: true, nomen: true*/
/*global _gaq*/

var YOC = {};

YOC.view = function (spec, my) {
    'use strict';

    var that = {},
        el = document.getElementById(spec.id),
        subviews = [],
        target = spec.target;

    my = my || {};

    that.set_hidden = function (should_hide) {
        if (should_hide) {
            el.style.display = 'none';
        } else {
            el.style.display = 'block';
        }
    };

    that.set_transparent = function (should_be_transparent) {
        if (should_be_transparent) {
            el.style.opacity = 0;
        } else {
            el.style.opacity = 1;
        }
    };

    that.add_subview = function (view) {
        subviews.push(view);
    };

    that.get_el = function () {
        return el;
    };

    that.get_subviews = function () {
        return subviews;
    };

    that.set_target = function (t) {
        target = t;
    };

    that.get_target = function (t) {
        return target;
    };

    that.click = function (event) {
        event.stopPropagation();
        if (target && target.hasOwnProperty('view_did_click')) {
            target.view_did_click(that, event);
        }
    };

    el.addEventListener('click', that.click);

    return that;
};

YOC.movieView = function (spec, my) {
    'use strict';

    var that = YOC.view(spec, my),

        pad = function (num, size) {
            var s = "000" + num;
            return s.substr(s.length - size);
        },

        showFrame = function (frame, delay, total) {
            setTimeout(function () {
                frame.style.display = 'block';

                if (that.get_el().lastChild === frame && that.get_target() && that.get_target().hasOwnProperty('movie_did_finish')) {
                    that.get_target().movie_did_finish(that);
                }
            }, delay);
        },

        backward = function () {
            var i, frames = that.get_el().children;
            for (i = 41; i > 0; i = i - 1) {
                if (frames[i].style.display === 'block') {
                    frames[i].style.display = 'none';
                    break;
                }
            }
        },

        forward = function () {
            var i, frames = that.get_el().children;
            for (i = 0; i < frames.length; i = i + 1) {
                if (frames[i].style.display === 'none') {
                    frames[i].style.display = 'block';
                    break;
                }
            }
        },

        rewind = function () {
            var i, frames = this.get_el().children;
            for (i = 0; i < frames.length; i = i + 1) {
                frames[i].style.display = 'none';
            }

            frames[0].style.display = 'block';
        },

        load = function (spec) {
            var i, img, firstChild;

            for (i = 0; i <= spec.frames; i = i + 1) {
                img = document.createElement('img');
                img.src = 'assets/s.gif';
                if (spec.pad && typeof spec.pad === 'number') {
                    img.className = spec.prefix + pad(i, spec.pad);
                } else {
                    img.className = spec.prefix + i;
                }

                img.id = 'frame-' + i;
                img.className = img.className + ' frame';
                img.style.display = 'none';
                that.get_el().appendChild(img);
            }

            firstChild = that.get_el().firstChild;
            while (firstChild !== null && firstChild.nodeType === 3) {
                firstChild = firstChild.nextSibling;
            }
            firstChild.style.display = 'block';
        },

        play = function () {
            var i,
                frames = that.get_el().children;

            for (i = 0; i < frames.length; i = i + 1) {
                showFrame(frames[i], i * 50, frames.length);
            }
        };

    that.load = load;
    that.play = play;
    that.forward = forward;
    that.backward = backward;
    that.rewind = rewind;

    return that;
};

YOC.draggableView = function (spec, my) {
    'use strict';
    var that = YOC.view(spec, my),
        touchmove = function (event) {
            var x = event.touches[0].clientX,
                target = that.get_target();

            if (that.get_el().id === 'knife') {
                that.get_el().style.left = x - 70 + 'px';
            }

            if (target && target.hasOwnProperty('draggable_view_did_drag')) {
                target.draggable_view_did_drag(that, event);
            }
        },

        touchstart = function (event) {
            var target = that.get_target();
            if (target && target.hasOwnProperty('draggable_view_will_drag')) {
                target.draggable_view_will_drag(that, event);
            }
        };

    that.get_el().addEventListener('touchmove', touchmove);
    that.get_el().addEventListener('touchstart', touchstart);
    return that;
};

YOC.viewController = function (spec, my) {
    'use strict';

    var that = {},
        outlets = {},

        add_outlet = function (spec) {
            outlets[spec.name] = spec.dest;
        },

        get_outlet = function (name) {
            return outlets[name];
        },

        track = function (category, action, opt_label, opt_value, opt_noninteraction) {
            _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
            console.log('Tracking. Category = ' + category + ', action = ' + action);
        };

    my = my || {};

    that.add_outlet = add_outlet;
    that.get_outlet = get_outlet;
    that.track = track;

    return that;
};
