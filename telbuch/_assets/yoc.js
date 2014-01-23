/*jslint browser: true, devel: true*/
/*global _gaq*/

var YOC = {};

YOC.view = function (spec, my) {
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

    get_delegate = function (t) {
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
};

YOC.movieView = function (spec, my) {
  'use strict';

  var that = YOC.view(spec, my),

    pad = function (num, size) {
      var s = "000" + num;
      return s.substr(s.length - size);
    },

    toggleFrame = function (frame, delay, total) {
      setTimeout(function () {
        frame.style.display = frame.style.display === 'block' ? 'none' : 'block';
        if (that.get_el().lastChild === frame && that.get_delegate() && that.get_delegate().hasOwnProperty('movie_did_finish')) {
          that.get_delegate().movie_did_finish(that);
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

    last_frame_did_load = function (event) {
      var delegate = that.get_delegate();
      if (delegate && delegate.hasOwnProperty('movie_did_load')) {
        delegate.movie_did_load(that, event);
      }
    },

    load = function (spec) {
      var i, img, firstChild;
      spec.format = spec.format || 'jpg';

      that.get_el().innerHTML = '';

      for (i = 0; i < spec.frames; i = i + 1) {
        img = document.createElement('img');

        if (spec.pad && typeof spec.pad === 'number') {
          img.src = (spec.dir || '') + spec.prefix + pad(i, spec.pad) + '.' + spec.format;
        } else {
          img.src = (spec.dir || '') + spec.prefix + i + '.' + spec.format;
        }

        img.id = 'frame-' + i;
        img.className = 'frame';
        img.style.display = 'none';
        that.get_el().appendChild(img);
      }

      img.addEventListener('load', last_frame_did_load);
    },

    play = function (spec) {
      var i,
        frames = that.get_el().children;

      for (i = 0; i < frames.length; i = i + 1) {
        toggleFrame(frames[i], i * spec.delay, frames.length);
        if (frames[i - 1]) {
          toggleFrame(frames[i - 1], i * spec.delay, frames.length);
        }
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
  var that = YOC.view(spec, my),
    touchmove = function (event) {
      var x = event.touches[0].clientX,
        delegate = that.get_delegate();

      if (that.get_el().id === 'knife') {
        that.get_el().style.left = x - 70 + 'px';
      }

      if (delegate && delegate.hasOwnProperty('draggable_view_did_drag')) {
        delegate.draggable_view_did_drag(that, event);
      }
    },

    touchstart = function (event) {
      var delegate = that.get_delegate();
      if (delegate && delegate.hasOwnProperty('draggable_view_will_drag')) {
        delegate.draggable_view_will_drag(that, event);
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
