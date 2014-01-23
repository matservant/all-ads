/*jslint browser: true*/
/*global YOC*/

YOC.slideshowView = function (spec, my) {
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