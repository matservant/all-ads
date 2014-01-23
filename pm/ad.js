/*jslint browser: true, devel: true*/
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
/*jslint browser: true, devel: true*/
/*global YOC*/

var PM = {};

PM.viewController = function (spec, my) {
  'use strict';

  var that = YOC.viewController(spec, my),

    show_jetzt_clicken = function () {
      that.get_outlet('logo').set_hidden(false);
      document.getElementById('scene-4').style.display = 'block';
      document.getElementById('scene-4').style.opacity = 0.7;
    },

    view_did_click = function (view, event) {
      if (view === that.get_outlet('cta')) {
        that.track('First CTA: Probiere jetzt...', 'Click');
        that.get_outlet('sceneThree').set_hidden(false);
        that.get_outlet('sceneThree').set_transparent(false);
        that.get_outlet('cta').set_hidden(true);
        that.get_outlet('logo').set_hidden(true);
      } else if (view === that.get_outlet('link')) {
        that.track('Second CTA: Zum Verlieben', 'Click');
        // simulate link
        // TODO: add a metod to YOC.ViewController
        var a = document.createElement('a'),
          dispatch = document.createEvent("HTMLEvents"),
          url = 'http://bit.ly/ZFe92j';
        a.href = url;
        a.target = '_blank';
        dispatch.initEvent('click', true, true);
        a.dispatchEvent(dispatch);
      } else if (view === that.get_outlet('logo')) {
        that.track('Left logo', 'Click');
      }
    },

    movie_did_finish = function (movie) {
      if (movie.get_el().id === 'movie') {
        that.track('Intro movie', 'Stop playing');
        that.get_outlet('sceneTwo').set_transparent(false);
      }
    },

    prevX = 0,

    draggable_view_did_drag = function (view, event) {
      var x = view.get_el().offsetLeft || parseInt(view.get_el().style.left, 10);

      if (x >= 113) {
        that.get_outlet('extendView').set_hidden(false);
        view.set_transparent(true);

        if (x > that.prevX) {
          that.get_outlet('extendView').forward();
        } else {
          that.get_outlet('extendView').backward();
        }
      } else {
        view.set_transparent(false);
        that.get_outlet('extendView').set_hidden(true);
        that.get_outlet('extendView').rewind();
      }

      that.prevX = x;
    },

    draggable_view_will_drag = function (view, event) {
      that.track('Knife', 'Start dragging');
      that.get_outlet('arrow').set_hidden(true);
      setTimeout(show_jetzt_clicken, 4000);
    },

    draggable_view_should_drag = function (view, event) {
      return true;
    },

    view_did_load = function () {
      that.get_outlet('extendView').set_hidden(true);
      that.track('Intro movie', 'Start playing', null, null, true);
      that.get_outlet('movie').play();
    };

  my = my || {};

  that.view_did_load = view_did_load;
  that.movie_did_finish = movie_did_finish;
  that.draggable_view_did_drag = draggable_view_did_drag;
  that.draggable_view_will_drag = draggable_view_will_drag;
  that.view_did_click = view_did_click;

  return that;
};

window.onload = function () {
  'use strict';

  var viewController = PM.viewController(),
    adView = YOC.view({id: 'ad', target: viewController}),
    logoView = YOC.view({id: 'logo', target: viewController}),
    ctaView = YOC.view({id: 'cta', target: viewController}),
    sceneTwoView = YOC.view({id: 'scene-2', target: viewController}),
    sceneThreeView = YOC.view({id: 'scene-3', target: viewController}),
    knifeView = YOC.draggableView({id: 'knife', target: viewController}),
    extendView = YOC.movieView({id: 'extend-frames', target: viewController}),
    arrowView = YOC.movieView({id: 'right-arrow', target: viewController}),
    movie = YOC.movieView({id: 'movie', target: viewController}),
    link = YOC.view({id: 'scene-4', target: viewController}),

    prevent_scroll = function () {
      document.addEventListener('touchmove', function () {
        event.preventDefault();
      });
    };

  movie.load({prefix: 'movie', frames: 103, pad: 3});
  extendView.load({prefix: 'extend', frames: 41});

  viewController.add_outlet({name: 'movie', dest: movie});
  viewController.add_outlet({name: 'cta', dest: ctaView});
  viewController.add_outlet({name: 'logo', dest: logoView});
  viewController.add_outlet({name: 'sceneTwo', dest: sceneTwoView});
  viewController.add_outlet({name: 'sceneThree', dest: sceneThreeView});
  viewController.add_outlet({name: 'knife', dest: knifeView});
  viewController.add_outlet({name: 'extendView', dest: extendView});
  viewController.add_outlet({name: 'arrow', dest: arrowView});
  viewController.add_outlet({name: 'link', dest: link});

  viewController.view_did_load();

  window.onscroll = function() {
    document.getElementById('barcoo').style.top =
      (window.pageYOffset + window.innerHeight - 20) + 'px';
  };

  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 1000);
  
  prevent_scroll();
};