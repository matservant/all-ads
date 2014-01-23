/*jslint browser: true*/
/*global ga*/
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

        ga_init = function (ua, domain) {
            (function(i, s, o, g, r, a, m) {
                i.GoogleAnalyticsObject = r;
                i[r] = i[r] || function () {(i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async=1;
                a.src=g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', ua, domain);
            ga('send', 'pageview');
        },

        ga_send = function (event, category, action, label, value) {
            ga('send', event, category, action, label, value);
        };

    my = my || {};

    that.add_outlet = add_outlet;
    that.get_outlet = get_outlet;
    that.ga_init = ga_init;
    that.ga_send = ga_send;

    return that;
};