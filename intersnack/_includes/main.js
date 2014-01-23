/*jslint browser: true, devel: true*/

var firstSceneEl = document.getElementById('first-scene'),
    secondSceneEl = document.getElementById('second-scene'),
    thirdSceneEl = document.getElementById('third-scene'),
    fourthSceneEl = document.getElementById('fourth-scene'),
    fifthSceneEl = document.getElementById('fifth-scene'),
    erasableEl = document.getElementById('erasable'),
    ctaEl = document.getElementById('cta'),
    containerEl = document.getElementById('container'),
    backgroundEl = document.getElementById('background'),
    packshotEl = document.getElementById('packshot'),
    mehrErfahrenEl = document.getElementById('mehr-erfahren'),
    cauldronEl = document.getElementById('cauldron'),
    heroChipEl = document.getElementById('hero-chip'),
    packshotCloseEl = document.getElementById('packshot-close'),
    allChipsEl = document.getElementById('all-chips'),
    logoEl = document.getElementById('logo-small'),

    landingPageURL = '//yoc-ly.appspot.com/5899781826150400',

    context = erasableEl.getContext('2d'),

    containerX = window.innerWidth / 2 - containerEl.offsetWidth / 2,
    containerY = (window.innerHeight / 2 - containerEl.offsetHeight / 2) < 0 ? 0 : (window.innerHeight / 2 - containerEl.offsetHeight / 2),

    initialOpacity = 0.6,

    matrix = [],
    totalPoints = 320 * 568,
    points = 0,
    ratio = 0,

    screenHeight = screen.height >= 568 ? 568 : 480,

    mark = function (x, y) {
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

    hide_cta = function () {
        'use strict';
        ctaEl.style.display = 'none';
    },

    image = new Image(),

    move_background = function () {
        'use strict';
        backgroundEl.style.webkitTransform = 'translateX(-90px)';
    },

    open_landing_page = function () {
        'use strict';
        window.open(landingPageURL);
    },

    show_seventh_scene = function () {
        'use strict';
        packshotEl.style.opacity = 1;
        mehrErfahrenEl.style.opacity = 1;
        packshotCloseEl.style.opacity = 0;
        window.addEventListener('touchstart', open_landing_page);
        allChipsEl.style.opacity = 0;
        heroChipEl.style.opacity = 0;
        logoEl.style.opacity = 0;
    },

    show_sixth_scene = function () {
        'use strict';
        packshotCloseEl.style.webkitTransform = 'scale(1) translateY(0)';
        heroChipEl.style.webkitTransform = 'scale(0.3) translateY(240px) rotate(130deg)';
        setTimeout(show_seventh_scene, 1500);
    },

    show_fifth_scene = function () {
        'use strict';
        allChipsEl.style.webkitTransitionDuration = '1s';
        allChipsEl.style.webkitTransform = 'translateY(600px)';
        allChipsEl.style.opacity = 0;
        cauldronEl.style.webkitTransform = 'scale(8) translateY(500px)';
        heroChipEl.style.webkitTransform = 'scale(1) translateY(-130px) rotate(0)';
        heroChipEl.style.opacity = 1;
        setTimeout(show_sixth_scene, 1500);
    },

    show_fourth_scene = function () {
        'use strict';
        allChipsEl.style.webkitTransform = 'translateY(-500px) scale(3)';
        setTimeout(show_fifth_scene, 1500);
    },

    show_third_scene = function () {
        'use strict';
        cauldronEl.style.webkitTransform = 'scale(1.7) translateX(10px) translateY(60px)';
        allChipsEl.style.opacity = 1;
        setTimeout(show_fourth_scene, 500);
    },

    show_second_scene = function () {
        'use strict';
        move_background();
        erasableEl.style.opacity = 0;
        setTimeout(show_third_scene, 500);
    },

    trigger_animation = function () {
        'use strict';
        setTimeout(show_second_scene, 4000);
        erasableEl.removeEventListener('touchstart', trigger_animation);
    },

    prepare_canvas = function () {
        'use strict';
        image.src = 'img/no-fog.jpg';
        image.onload = function () {
            var pattern = context.createPattern(this, 'repeat');
            context.strokeStyle = pattern;
        };

        context.lineWidth = 80;
        erasableEl.addEventListener('touchmove', continue_path);
        erasableEl.addEventListener('touchmove', hide_cta);
        erasableEl.addEventListener('touchstart', start_path);
        erasableEl.addEventListener('touchstart', trigger_animation);
    },

    prevent_scroll = function () {
        'use strict';
        window.addEventListener('touchstart', function (event) {
            event.preventDefault();
        });
    },

    hide_navigation_bar = function () {
        'use strict';
        setTimeout(function () {
            window.scrollTo(0, 1);
        }, 0);
    };

window.addEventListener('load', function () {
    'use strict';
    prepare_canvas();
    hide_navigation_bar();
});