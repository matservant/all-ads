/*jslint browser: true, devel: true*/
/*global createjs*/

var view = function (spec, my) {
        'use strict';

        var that = {},
            el = document.getElementById(spec.id),
            subviews = [],
            delegate = spec.delegate,

            set_hidden = function (should_hide) {
                if (should_hide) {
                    el.style.display = 'none';
                } else {
                    el.style.display = 'block';
                }
            },

            set_transparent = function (should_be_transparent) {
                if (should_be_transparent) {
                    el.style.opacity = 0;
                } else {
                    el.style.opacity = 1;
                }
            },

            add_subview = function (view) {
                subviews.push(view);
            },

            get_el = function () {
                return el;
            },

            get_subviews = function () {
                return subviews;
            },

            set_delegate = function (t) {
                delegate = t;
            },

            get_delegate = function () {
                return delegate;
            },

            click = function (event) {
                event.stopPropagation();
                if (delegate && delegate.hasOwnProperty('view_did_click')) {
                    delegate.view_did_click(that, event);
                }
            },

            touchstart = function (event) {
                event.stopPropagation();
                if (delegate && delegate.hasOwnProperty('view_did_touch')) {
                    delegate.view_did_touch(that, event);
                }
            };

        that.set_hidden = set_hidden;
        that.set_transparent = set_transparent;
        that.add_subview = add_subview;
        that.get_el = get_el;
        that.get_subviews = get_subviews;
        that.set_delegate = set_delegate;
        that.get_delegate = get_delegate;
        that.click = click;
        that.touchstart = touchstart;

        my = my || {};

        el.addEventListener('click', that.click);
        el.addEventListener('touchstart', that.touchstart);

        return that;
    },

    movie = function (spec, my) {
        'use strict';

        var that = view(spec, my),

            pad = function (num, size) {
                var s = "000" + num;
                return s.substr(s.length - size);
            },

            show_frame = function (frame, delay) {
                setTimeout(function () {
                    if (frame.previousSibling) {
                        frame.previousSibling.style.display = 'none';
                    }
                    frame.style.display = 'block';

                    if (that.get_delegate() && that.get_delegate().hasOwnProperty('movie_did_play_frame')) {
                        that.get_delegate().movie_did_play_frame(frame);
                    }

                    if (that.get_el().lastChild === frame && that.get_delegate() && that.get_delegate().hasOwnProperty('movie_did_finish')) {
                        that.get_delegate().movie_did_finish(that);
                    }
                }, delay);
            },

            backward = function () {
                var i, frames = that.get_el().children;
                for (i = frames.length; i > 0; i = i - 1) {
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

                for (i = spec.first || 0; i <= spec.last; i = i + 1) {
                    img = document.createElement('img');
                    img.src = 'img/s.gif';
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
                if (that.get_delegate() && that.get_delegate().hasOwnProperty('movie_did_load')) {
                    that.get_delegate().movie_did_load(that);
                }
            },

            play = function () {
                var i,
                    frames = that.get_el().children;

                for (i = 0; i < frames.length; i = i + 1) {
                    show_frame(frames[i], i * 60, frames.length);
                }
            };

        that.load = load;
        that.play = play;
        that.forward = forward;
        that.backward = backward;
        that.rewind = rewind;

        return that;

    },

    queue = new createjs.LoadQueue(),
    framesContainerEl = document.getElementById('frames-container'),
    posterEl = document.getElementById('poster'),

    show_poster = function () {
        'use strict';
        posterEl.style.display = 'block';
        posterEl.className = posterEl.className + ' animated bounceInDown';
    },

    append_frame_with_index_and_delay = function (index, delay) {
        'use strict';
        var id = 'frame-' + index;
        setTimeout(function () {
            if (framesContainerEl.firstChild) {
                framesContainerEl.removeChild(framesContainerEl.firstChild);
            }
            if (index === 59) {
                show_poster();
            }
            framesContainerEl.appendChild(queue.getResult(id));
        }, delay);
    },

    move_frame_container_to_bottom = function () {
        'use strict';
        framesContainerEl.style.top = framesContainerEl.clientWidth + 'px';
    },

    movie_did_play_frame = function (frame) {
        'use strict';
        if (frame.id === 'frame-60') {
            show_poster();
        }
    },

    movie_did_load = function (aMovie) {
        'use strict';
        aMovie.play();
    },

    myMovie = movie({id: 'frames-container', delegate: window}),

    view;

window.addEventListener('load', function () {
    'use strict';

    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);

    myMovie.load({prefix: 'smurfs_elevator_320x', last: 67, pad: 2});
});