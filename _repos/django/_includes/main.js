/*jslint browser: true, devel: true*/
/*global Audio, ga*/

var containerEl = document.getElementById("container"),
    startEls = document.getElementsByClassName("start"),
    endingEls = document.getElementsByClassName("ending"),
    leftDoorEl = document.getElementById("door-left"),
    rightDoorEl = document.getElementById("door-right"),
    portalEl = document.getElementById("portal"),
    backgroundEl = document.getElementById("background"),

    landingURL = "http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=6893373&PluID=0&ord=" + new Date().getTime() + "&mb=1&ck=1",
    shotCount = {"door-left": 0, "door-right": 0},

    open_landing_page = function () {
        "use strict";
        var a = document.createElement('a'),
            dispatch = document.createEvent("HTMLEvents");

        a.href = landingURL;
        a.target = '_blank';

        dispatch.initEvent('click', true, true);
        a.dispatchEvent(dispatch);
    },

    show_ending = function () {
        "use strict";
        var i;

        backgroundEl.style.opacity = 1;

        setTimeout(function () {
            for (i = 0; i < endingEls.length; i = i + 1) {
                endingEls[i].style.opacity = 1;
            }

            for (i = 0; i < startEls.length; i = i + 1) {
                startEls[i].style.opacity = 0;
            }

            document.getElementById("door-left").style["-webkit-animation"] = "open 2s";
            document.getElementById("door-right").style["-webkit-animation"] = "open 2s";
            portalEl.style["-webkit-transform"] = "scale(10)";
            portalEl.style.opacity = 0;
            portalEl.style["pointer-events"] = "none";

            document.addEventListener("touchstart", function () {
                ga('send', 'event', 'button', 'click');
                open_landing_page();
            });
        }, 2000);
    },

    shot = function (event) {
        "use strict";

        shotCount[event.target.id] = shotCount[event.target.id] + 1;
        ga('send', 'event', 'door', 'touch', event.target.id, shotCount[event.target.id]);

        if (shotCount["door-left"] === 3) {
            leftDoorEl.removeEventListener("touchstart", shot);
        }

        if (shotCount["door-left"] === 3) {
            rightDoorEl.removeEventListener("touchstart", shot);
        }

        if (shotCount["door-left"] + shotCount["door-right"] === 3) {
            leftDoorEl.removeEventListener("touchstart", shot);
            rightDoorEl.removeEventListener("touchstart", shot);
            show_ending();
        }

        event.target.style.webkitAnimation = 'none';
        portalEl.style.webkitAnimation = 'none';

        setTimeout(function() {
            event.target.style.webkitAnimation = "swing 1s";
            portalEl.style.webkitAnimation = "shake 0.5s";
            event.target.src = event.target.id + "-" + shotCount[event.target.id] + "-fs8.png";
        }, 10);
    },

    prevent_scroll = function (event) {
        "use strict";
        event.preventDefault();
    },

    hide_navbar = function () {
        "use strict";

        setTimeout(function () {
            window.scrollTo(0, 1);
        }, 0);
    };

leftDoorEl.addEventListener("touchstart", shot);
rightDoorEl.addEventListener("touchstart", shot);
window.addEventListener("touchmove", prevent_scroll);
window.addEventListener("load", hide_navbar);