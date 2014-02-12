/*jslint browser: true, devel: true*/
/*globals ga*/
var erasableEl = document.getElementById("erasable"),
    ctaEl = document.getElementById("cta"),
    endingEl = document.getElementById("ending"),
    ventilatorEl = document.getElementById("ventilator"),
    raftingEl = document.getElementById("rafting"),
    streamOneEl = document.getElementById("stream-one"),
    streamTwoEl = document.getElementById("stream-two"),
    containerEl = document.getElementById("container"),
    shownEnding = false,

    context = erasableEl.getContext("2d"),
    interval,

    matrix = [],
    totalPoints = 320 * 568,
    points = 0,
    ratio = 0,
    screenHeight = screen.height >= 568 ? 568 : 480,
    containerX,
    containerY,

    didWipe = false,

    pad = function (val) {
        "use strict";

        var valString = val.toString();

        if (valString.length < 2) {
            return "0" + valString;
        }

        return valString;
    },

    mark = function(x, y) {
        "use strict";
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
        erasableEl.style.opacity = 0.5 - ratio / 2;
    },

    get_coord = function (event) {
        "use strict";
        var x = event.touches[0].clientX - 25 - containerX,
            y = event.touches[0].clientY - 25 - containerY;
        return [x, y];
    },

    start_path = function (event) {
        "use strict";

        if (!didWipe) {
            ga('send', 'event', 'wipe', 'start');
            didWipe = true;
        }

        var coord = get_coord(event);
        console.log(event.touches[0]);
        event.preventDefault();
        context.beginPath();
        context.moveTo(coord[0], coord[1]);
        ventilatorEl.style.left = event.touches[0].clientX - 50 - containerX + 'px';
        ventilatorEl.style.top = event.touches[0].clientY - 50 - containerY + 'px';
    },

    continue_path = function (event) {
        "use strict";
        event.preventDefault();
        var coord = get_coord(event);
        context.lineTo(coord[0], coord[1]);
        mark(coord[0], coord[1]);
        context.stroke();
        ventilatorEl.style.left = event.touches[0].clientX - 50 - containerX + 'px';
        ventilatorEl.style.top = event.touches[0].clientY - 50 - containerY + 'px';
    },

    hide_cta = function () {
        "use strict";
        ctaEl.style.display = "none";
    },


    show_ending = function () {
        "use strict";

        if (shownEnding) {
            return;
        }

        shownEnding = true;

        hide_cta();

        erasableEl.removeEventListener("touchmove", continue_path);
        erasableEl.removeEventListener("touchmove", hide_cta);
        erasableEl.removeEventListener("touchstart", start_path);
        erasableEl.style.opacity = 0;

        raftingEl.style["-webkit-transform"] = "rotate(0) translate(0) scale(1)";
        raftingEl.className = raftingEl.className + " shake";
        raftingEl.style.opacity = 1;

        ventilatorEl.style.display = "none";

        streamOneEl.style.opacity = 1;
        streamOneEl.className = streamOneEl.className + " flow";

        streamTwoEl.style.opacity = 1;
        streamTwoEl.className = streamOneEl.className + " flow flow-delay";

        document.body.addEventListener('touchstart', function () {
            ga('send', 'event', 'click', 'button');
            var a = document.createElement('a'),
                dispatch = document.createEvent("HTMLEvents"),
                url = 'http://smarturl.it/loreal-wipe-ad?ord=' + new Date().getTime();
            a.href = url;
            a.target = '_blank';
            dispatch.initEvent('click', true, true);
            a.dispatchEvent(dispatch);
        });
    },

    hundredths = 0,

    set_time = function () {
        "use strict";

        if (ratio > 0.4) {
            clearInterval(interval);
            show_ending();
            return;
        }

        hundredths = hundredths + 1;
    },

    image = new Image();

context.scale(2, 2);
image.src = "ending-" + screenHeight + "-1x.jpg";
image.onload = function () {
    "use strict";
    var pattern = context.createPattern(this, "repeat");
    context.strokeStyle = pattern;
};

context.lineWidth = 70;

window.addEventListener("touchmove", function(event) {
    'use strict';
    event.preventDefault();
});

window.addEventListener("load", function () {
    "use strict";

    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);

    console.log(screenHeight);
    containerEl.style.height = screenHeight - 64 + "px";
    containerX = window.innerWidth / 2 - containerEl.offsetWidth / 2;
    containerY = (window.innerHeight / 2 - containerEl.offsetHeight / 2) < 0 ? 0 : (window.innerHeight / 2 - containerEl.offsetHeight / 2);

    containerEl.style["background-image"] = "url(ending-" + screenHeight + ".jpg)";
    containerEl.style["background-size"] = "320px " + (screenHeight - 64) + "px";
    containerEl.style.left = containerX + "px";
    containerEl.style.top = containerY + "px";
    erasableEl.addEventListener("touchmove", continue_path);
    erasableEl.addEventListener("touchmove", hide_cta);
    erasableEl.addEventListener("touchstart", start_path);
    interval = setInterval(set_time, 10);

    setTimeout(show_ending, 6000);
});
