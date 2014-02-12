/*jslint browser: true, devel: true*/

window.addEventListener("load", function () {
    "use strict";

    window.addEventListener("touchmove", function(event) {
        event.preventDefault();
    });

    setTimeout(function () {
        window.scrollTo(0, 1);
        var top = (window.pageYOffset + window.innerHeight - 50) + 'px',
            banner = document.getElementById("banner"),
            link = document.getElementById("link");

        banner.style.top = top;
        link.style.top = top;
    }, 0);
});