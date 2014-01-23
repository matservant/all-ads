/*jslint browser: true, devel: true*/
/*global YOC*/

var O2 = {};

O2.viewController = function (spec, my) {
    'use strict';

    var that = YOC.viewController(spec, my),

        view_did_click = function (view, event) {
            that.track('Second CTA: Zum Verlieben', 'Click');

            var a = document.createElement('a'),
                dispatch = document.createEvent("HTMLEvents"),
                url = '#';

            a.href = url;
            a.target = '_blank';

            dispatch.initEvent('click', true, true);
            a.dispatchEvent(dispatch);
        },

        movie_did_finish = function (movie) {

        },

        movie = YOC.movieView({id: 'movie', target: that}),

        view_did_load = function () {
            console.log('here');
            that.ga_send('Intro movie', 'Start playing', null, null, true);
            movie.play();
        };

    my = my || {};

    that.view_did_load = view_did_load;
    that.movie_did_finish = movie_did_finish;
    that.view_did_click = view_did_click;

    movie.load({prefix: 'o2pearl_xx_video_818x460', last: 135, pad: 3});

    return that;
};

var controller = O2.viewController();
window.onload = controller.view_did_load;
