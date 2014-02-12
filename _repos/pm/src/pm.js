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