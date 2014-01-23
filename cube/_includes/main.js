/*jslint browser: true, devel: true*/
/*globals CUBE*/

window.addEventListener("load", function () {
    'use strict';

    try {
        CUBE.controller({
            backgroundColors: [
                '#ffb347',
                '#ff6961',
                '#fdfd96',
                '#b19cd9',
                '#cfcfc4',
                '#f49ac2'
            ],
            imageURLs: [
                '1.jpg',
                '3.jpg',
                '4.jpg',
                '6.jpg'
            ],
            destURLs: [
                'http://google.com',
                'http://apple.com',
                'http://yoc.de',
                'http://redbull.com',
                'http://adidas.com',
                'http://facebook.com',
                'http://twitter.com'
            ],
            sideLength: 200,
            rotationPeriod: '10s',
            backgroundImageURL: 'shapes.jpg',
            backgroundImageOpacity: 0.7,
            sideOpacity: 0.9,
            showCloseButton: true
        }).start();
    } catch (e) {
        console.log(e.name + ': ' + e.message);
    }
});