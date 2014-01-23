/*jslint browser: true, devel: true*/
/*global ga*/

var erasableEl = document.getElementById("erasable"),
    ctaEl = document.getElementById("cta"),
    timerEl = document.getElementById("timer"),
    ratioEl = document.getElementById("ratio"),
    minutesEl = document.getElementById("minutes"),
    secondsEl = document.getElementById("seconds"),
    hundredthsEl = document.getElementById("hundredths"),
    resultsEl = document.getElementById("results"),
    totalSecondsEl = document.getElementById("total-seconds"),
    dasWarenEl = document.getElementById("das-waren"),
    sekunden = document.getElementById("sekunden"),
    whiteLayerEl = document.getElementById("white-layer"),
    logoEl = document.getElementById("logo"),
    buttonEl = document.getElementById("button"),
    kabelBwEl = document.getElementById("kabel-bw"),
    conclusionEl = document.getElementById("conclusion"),
    containerEl = document.getElementById("container"),
    bottomEl = document.getElementById("bottom"),

    context = erasableEl.getContext("2d"),
    interval,
    containerX,
    containerY,

    initialOpacity = 0.6,

    matrix = [],
    totalPoints = 320 * 568,
    points = 0,
    ratio = 0,

    didWipe = false,

    screenHeight = screen.height >= 568 ? 568 : 480,

    get_param = function (name) {
        "use strict";
        return decodeURI(
            (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [null])[1]
        );
    },

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

        ratioEl.innerHTML = pad(Math.floor(ratio * 100)) + "%";
    },

    get_coord = function (event) {
        "use strict";
        var x = event.touches[0].clientX - containerX,
            y = event.touches[0].clientY - containerY;
        return [2 * x, 2 * y];
    },

    start_path = function (event) {
        "use strict";

        if (!didWipe) {
            ga('send', 'event', 'wipe', 'start');
            didWipe = true;
        }

        var coord = get_coord(event);
        event.preventDefault();
        context.beginPath();
        context.moveTo(coord[0], coord[1]);
    },

    continue_path = function (event) {
        "use strict";
        event.preventDefault();
        var coord = get_coord(event);
        console.log(coord);
        context.lineTo(coord[0], coord[1]);
        mark(coord[0], coord[1]);
        context.stroke();
    },

    hide_cta = function () {
        "use strict";
        ctaEl.style.display = "none";
    },

    hundredths = 0,

    showResults = function (seconds) {
        "use strict";
        ga('send', 'event', 'results', 'shown');
        resultsEl.style.display = 'block';
        totalSecondsEl.innerHTML = seconds;
        if (seconds > 5) {
            conclusionEl.innerHTML = "Das geht noch besser.";
        }
        setTimeout(function () {
            logoEl.style.display = 'block';
            dasWarenEl.style["-webkit-transform"] = "scale(1)";
            dasWarenEl.style.opacity = 1;
            totalSecondsEl.style["-webkit-transform"] = "scale(1)";
            totalSecondsEl.style.opacity = 1;
            sekunden.style["-webkit-transform"] = "scale(1)";
            conclusionEl.style["-webkit-transform"] = "scale(1)";
            conclusionEl.style.opacity = 1;
            sekunden.style.opacity = 1;
            whiteLayerEl.style.opacity = 1;
            buttonEl.style.display = 'block';
            buttonEl.style.opacity = 1;
            logoEl.style.opacity = 1;
            kabelBwEl.style.opacity = 1;
            buttonEl.style["pointer-events"] = "auto";
            containerEl.addEventListener("touchstart", function () {
                ga('send', 'event', 'button', 'click');
                window.open(buttonEl.href);
            });
        }, 100);
    },

    setTime = function () {
        "use strict";
        var h = parseInt(hundredths % 100, 10),
            s = parseInt((hundredths / 100) % 60, 10),
            m = parseInt((hundredths / 100) / 60, 10);

        if (ratio > 0.5) {
            clearInterval(interval);
            showResults(s);
            return;
        }

        hundredths = hundredths + 1;

        minutesEl.innerHTML = pad(m);
        secondsEl.innerHTML = pad(s);
        hundredthsEl.innerHTML = pad(h);
    },

    image = new Image();

image.src = "bg_main.jpg";
image.onload = function () {
    "use strict";
    context.strokeStyle = "white";
};

context.lineWidth = 80;

window.addEventListener("load", function () {
    "use strict";

    window.addEventListener("touchmove", function(event) {
        event.preventDefault();
    });

    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);

    // containerEl.style.height = screenHeight - 64 + "px";
    containerX = window.innerWidth / 2 - containerEl.offsetWidth / 2;
    containerY = (window.innerHeight / 2 - containerEl.offsetHeight / 2) < 0 ? 0 : (window.innerHeight / 2 - containerEl.offsetHeight / 2);
    containerEl.style.left = containerX + "px";
    containerEl.style.top = containerY + "px";
    logoEl.style.left = window.innerWidth / 2 - logoEl.offsetWidth / 2 + "px";
    bottomEl.style.left = window.innerWidth / 2 - bottomEl.offsetWidth / 2 + "px";

    if (get_param("unity") === "true") {
        kabelBwEl.src = "unity-media-logo.png";
        buttonEl.href = "http://ad.mo.doubleclick.net/dartproxy/dfa.tracker.handler?k=272691958;98002151;o";
    } else {
        buttonEl.href = "http://ad.mo.doubleclick.net/dartproxy/dfa.tracker.handler?k=272693793;97986160;h";
    }

    ctaEl.style.display = "block";
    timerEl.style.display = "block";
    erasableEl.style.opacity = initialOpacity;
    erasableEl.style["-webkit-transition"] = "";
    erasableEl.addEventListener("touchmove", continue_path);
    erasableEl.addEventListener("touchmove", hide_cta);
    erasableEl.addEventListener("touchstart", start_path);
    interval = setInterval(setTime, 10);
});