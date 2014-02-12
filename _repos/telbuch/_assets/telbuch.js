/*jslint browser: true, devel: true*/
/*global YOC*/

var TB = {};

TB.viewController = function (spec, my) {
  'use strict';

  var that = YOC.viewController(spec, my),
    movie = YOC.movieView({id: 'glass-movie', delegate: that}),
    glass = YOC.view({id: 'glass', delegate: that}),
    cta = YOC.view({id: 'cta', delegate: that}),
    pressHere = YOC.view({id: 'press-here', delegate: that}),
    zuFest = YOC.view({id: 'zu-fest', delegate: that}),
    button = YOC.view({id: 'button', delegate: that}),
    movie_is_loaded = false,
    should_hide_glass = false,
    pixel = document.createElement('img'),

    show_cta = function () {
      setTimeout(function () {
        cta.set_hidden(false);
        zuFest.set_hidden(true);
        glass.set_hidden(true);
      }, 3000);
    },

    movie_did_load = function () {
      movie_is_loaded = true;
    },

    movie_did_finish = function () {
      console.log('movie_did_play');
      setTimeout(function () {
        zuFest.set_hidden(false);
      }, 1000);
      should_hide_glass = true;
      show_cta();
    },

    load_movie = function () {
      movie_is_loaded = false;
      var isportrait = window.matchMedia("(orientation: portrait)").matches;

      if (isportrait) {
        movie.load({prefix: 'portrait/glass', frames: 4, pad: 2, format: 'png'});
      } else {
        movie.load({prefix: 'landscape/glass', frames: 4, pad: 2, format: 'png'});
      }
    },

    view_did_load = function () {
      load_movie();
    },

    get_param = function (param) {
      return decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    },

    clickURL = get_param("clickURL") || "http://ad-emea.doubleclick.net/clk;269832417;95903304;o",

    view_did_touch = function (view, event) {
      if (view === pressHere && movie_is_loaded) {
        pressHere.set_hidden(true);
        movie.play({delay: 125});
      } else if (view === button) {
        window.open(clickURL);
      }
    };

  my = my || {};

  that.view_did_load = view_did_load;
  that.movie_did_load = movie_did_load;
  that.view_did_touch = view_did_touch;
  that.movie_did_finish = movie_did_finish;

  window.addEventListener('orientationchange', function (event) {
    if (that.should_hide_glass) {
      glass.set_hidden(true);
      return;
    }
    load_movie();
  });

  glass.set_hidden(false);
  zuFest.set_hidden(true);
  cta.set_hidden(true);

  pixel.src = 'http://ad-emea.doubleclick.net/ad/N3722.134178.YOCDE/B7399523.4;sz=1x1;ord=' + get_param("ord") + '?';
  pixel.border = 0;
  pixel.width = 1;
  pixel.height = 1;
  pixel.alt = 'Advertisement';
  pixel.style.display = 'none';
  document.body.appendChild(pixel);

  return that;
};

window.onload = function () {
  'use strict';

  var viewController = TB.viewController();

  viewController.view_did_load();
  // prevent_scroll();
};