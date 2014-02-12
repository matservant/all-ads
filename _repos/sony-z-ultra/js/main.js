/*jslint browser: true, devel: true*/

var backgroundEl = document.getElementById('background'),
    sonyLinkEl = document.getElementById('sony-link'),
    o2LinkEl = document.getElementById('o2-link'),
    yoc_ly_tracker_for_id_and_medium = function (id, medium) {
        'use strict';
        return 'http://yoc-ly.appspot.com/' + id + '?campaign=sony&medium=' + medium;
    },
    substituteBackground = function () {
        'use strict';
        var bg = window.getComputedStyle(backgroundEl).getPropertyValue('background'),
            url = bg.match(/url\([\w\W]*\)/)[0];

        if (/motiv=stift$/.test(window.location.href)) {
            url = url.replace('flugzeug', 'steg');
            sonyLinkEl.href = yoc_ly_tracker_for_id_and_medium('5092662981951488', 'stift');
            o2LinkEl.href = yoc_ly_tracker_for_id_and_medium('5707702298738688', 'stift');
        } else if (/motiv=wasserfest$/.test(window.location.href)) {
            url = url.replace('flugzeug', 'steg2');
            sonyLinkEl.href = yoc_ly_tracker_for_id_and_medium('5144752345317376', 'wasserfest');
            o2LinkEl.href = yoc_ly_tracker_for_id_and_medium('5905064635924480', 'wasserfest');
        }

        backgroundEl.style.backgroundImage = url;
        backgroundEl.style.display = 'block';
    };

window.addEventListener('load', substituteBackground);

window.addEventListener('orientationchange', function () {
    'use strict';
    backgroundEl.style.backgroundImage = '';
    substituteBackground();
});