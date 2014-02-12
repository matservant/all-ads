/*jslint browser: true, devel: true*/
/*global ga*/

var erasableEl = document.getElementById('erasable'),
    ctaEl = document.getElementById('cta'),
    containerEl = document.getElementById('container'),
    context = erasableEl.getContext('2d'),
    posterEl = document.getElementById('poster'),

    containerX,
    containerY,

    initialOpacity = 0.6,

    matrix = [],
    totalPoints = 320 * 568,
    points = 0,
    ratio = 0,

    screenHeight = screen.height >= 568 ? 568 : 480,

    mark = function(x, y) {
        'use strict';
        var i, j;

        for (i = x - 20; i < x + 20; i = i + 1) {
            if (!matrix[i]) {
                matrix[i] = [];
            }

            for (j = y - 20; j < y + 20; j = j + 1) {
                if (matrix[i][j] !== true) {
                    matrix[i][j] = true;
                    points = points + 1;
                    ratio = points / totalPoints;
                }
            }
        }
    },

    get_coord = function (event) {
        'use strict';
        var x = event.touches[0].clientX - containerX,
            y = event.touches[0].clientY - containerY;
        return [2 * x, 2 * y];
    },

    start_path = function (event) {
        'use strict';
        var coord = get_coord(event);
        event.preventDefault();
        context.beginPath();
        context.moveTo(coord[0], coord[1]);
    },

    continue_path = function (event) {
        'use strict';
        event.preventDefault();
        var coord = get_coord(event);
        context.lineTo(coord[0], coord[1]);
        mark(coord[0], coord[1]);
        context.stroke();
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

    show_poster = function () {
        'use strict';
        posterEl.style.pointerEvents = 'auto';
        posterEl.style.opacity = 1;
    },

    hide_cta = function () {
        'use strict';
        ctaEl.style.display = 'none';
    },

    open_landing_page = function () {
        'use strict';
        if (location.search === '?dec') {
            go_to('//yoc-ly.appspot.com/5771972189356032');
            return;
        }
        go_to('//yoc-ly.appspot.com/5870670537818112');
    },

    image = new Image();

image.src = 'img/hol-alles-raus.jpg';
image.onload = function () {
    'use strict';
    var pattern = context.createPattern(this, 'repeat');
    context.strokeStyle = pattern;
};

context.lineWidth = 80;

window.addEventListener('load', function () {
    'use strict';

    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);

    if (window.navigator.msPointerEnabled) {
        window.addEventListener('MSPointerDown', function (event) {
            event.preventDefault();
        });

        posterEl.addEventListener('MSPointerDown', open_landing_page);
        erasableEl.addEventListener('MSPointerMove', continue_path);
        erasableEl.addEventListener('MSPointerMove', hide_cta);
        erasableEl.addEventListener('MSPointerDown', start_path);
    } else {
        window.addEventListener('touchmove', function(event) {
            event.preventDefault();
        });
        
        posterEl.addEventListener('touchstart', open_landing_page);
        erasableEl.addEventListener('touchmove', continue_path);
        erasableEl.addEventListener('touchmove', hide_cta);
        erasableEl.addEventListener('touchstart', start_path);
    }

    setTimeout(show_poster, 6000);

    containerX = window.innerWidth / 2 - containerEl.offsetWidth / 2;
    containerY = (window.innerHeight / 2 - containerEl.offsetHeight / 2) < 0 ? 0 : (window.innerHeight / 2 - containerEl.offsetHeight / 2);
    containerEl.style.left = containerX + 'px';
    containerEl.style.top = containerY + 'px';
});