/*jslint browser: true, devel: true*/
/*global FileReader, FB, Blob, EXIF, MegaPixImage*/
var retinaFactor = window.devicePixelRatio,
    transform,
    orientation,

    camera_input = function (delegate) {
        'use strict';

        var that = {},
            el = document.getElementById('camera-input'),

            change = function (event) {
                delegate.did_choose_file(event.target.files[0]);
            },

            hide = function () {
                document.getElementById('camera-button-wrapper').style.display = 'none';
            },

            show = function () {
                el.addEventListener('change', change);
            };

        that.show = show;
        that.hide = hide;
        return that;
    },

    wandele = function () {
        'use strict';

        var that = {},
            el = document.getElementById('wandele'),
            show = function () {
                el.style.opacity = 1;
                el.style.display = 'block';
                el.style.marginLeft = '-5px';
            },
            hide = function () {
                el.style.opacity = 0;
                el.style.display = 'none';
            };

        that.show = show;
        that.hide = hide;
        return that;
    },

    windows = function () {
        'use strict';

        var that = {},
            el = document.getElementById('windows'),
            show = function () {
                el.style.opacity = 1;
                el.style.display = 'block';
                el.style.marginLeft = '-5px';
            },
            hide = function () {
                el.style.opacity = 0;
                el.style.display = 'none';
            };

        that.show = show;
        that.hide = hide;
        return that;
    },

    cta = function () {
        'use strict';

        var that = {},
            el = document.getElementById('letterpress'),
            hide = function () {
                el.style.opacity = 0;
            };

        that.hide = hide;
        return that;
    },

    image_placeholder = function () {
        'use strict';

        var that = {},
            el = document.getElementById('image-placeholder'),

            hide = function () {
                el.style.borderColor = '#4fbdbe';
            },

            show_phone = function () {
                var frame = document.getElementById('phone-vert'),
                    wrapper = document.getElementById('picture-wrapper');
                wrapper.style.backgroundColor = 'black';
                frame.style.opacity = 1;
            };

        that.show_phone = show_phone;
        that.hide = hide;
        return that;
    },

    spinner = function () {
        'use strict';

        var that = {},
            el = document.getElementById('spinner'),
            show = function () {
                el.style.opacity = 1;
                el.style.display = 'block';
            },
            hide = function () {
                el.style.opacity = 0;
                el.style.display = 'none';
            };

        that.show = show;
        that.hide = hide;
        return that;
    },

    picture = function (delegate) {
        'use strict';

        var that = {},
            el = document.getElementById('picture'),

            get_blob = function () {
                var blob;
                if (el.toBlob) {
                    el.toBlob(
                        function (b) {
                            blob = b;
                        },
                        'image/jpeg'
                    );
                }

                return blob;
            },

            draw_logo = function (size) {
                var logo = new Image();

                size = size || 0.5;

                logo.src = 'img/windows.png';
                logo.addEventListener('load', function (event) {
                    el.getContext("2d").drawImage(event.target, 8, 8, 320 * size, 75 * size);
                });
            },

            brighten = function (adjustment) {
                delegate.will_start_brightening();
                var context = el.getContext('2d'),
                    imageData = context.getImageData(0, 0, el.width, el.height),
                    d = imageData.data,
                    i;

                for (i = 0; i < d.length; i = i + 4) {
                    d[i] = d[i] + adjustment;
                    d[i + 1] = d[i + 1] + adjustment;
                    d[i + 2]  = d[i + 2] + adjustment;
                }
                context.putImageData(imageData, 0, 0);
                draw_logo();
                delegate.did_stop_brightening();
            },

            show = function () {
                el.style.opacity = 1;
            },

            get_height = function () {
                return el.clientHeight;
            },

            load_file = function (file) {
                var image = new MegaPixImage(file),
                    context = el.getContext("2d");

                EXIF.getData(file, function () {
                    context.save();
                    var orientation = EXIF.getTag(this, "Orientation");
                    image.render(el, { height: el.clientHeight * 4, orientation: orientation });
                    context.restore();
                });
                image.onrender = delegate.did_load_image;
            };

        that.brighten = brighten;
        that.show = show;
        that.get_blob = get_blob;
        that.get_height = get_height;
        that.load_file = load_file;
        return that;
    },

    facebook_button = function (delegate) {
        'use strict';

        var that = {},
            el = document.getElementById('facebook'),
            enabled = false,

            touchstart = function () {
                if (!enabled) {
                    return;
                }
                delegate.did_press_button(that);
            },

            set_enabled = function (en) {
                enabled = en;
                el.style.opacity = en ? 1 : 0.5;
            },

            show = function () {
                el.addEventListener('touchstart', touchstart);
            };

        that.set_enabled = set_enabled;
        that.show = show;
        return that;
    },

    brightness_button = function (delegate) {
        'use strict';

        var that = {},
            el = document.getElementById('brightness'),
            enabled = false,

            touchstart = function () {
                if (!enabled) {
                    return;
                }
                delegate.did_press_button(that);
            },

            set_enabled = function (en) {
                enabled = en;
                el.style.opacity = en ? 1 : 0.5;
            },

            show = function () {
                el.addEventListener('touchstart', touchstart);
            };

        that.set_enabled = set_enabled;
        that.show = show;
        return that;
    },

    ad = function () {
        'use strict';

        var that = {},
            myCameraInput = camera_input(that),
            myPicture = picture(that),
            myFacebookButton = facebook_button(that),
            myBrightnessButton = brightness_button(that),
            myCTA = cta(),
            mySpinner = spinner(),
            myImagePlaceholder = image_placeholder(that),
            myWandele = wandele(that),
            myWindows = windows(that),

            did_choose_image = function (file) {
                myPicture.set_image(file);
            },

            did_finish_posting_to_facebook = function (event) {
                var resp = JSON.parse(event.target.response);
                mySpinner.hide();

                if (!resp || resp.error) {
                    alert('There was an error posting to Facebook. Please try again later!');
                } else {
                    alert('You\'ve posted the pic to Facebook! http://facebook.com/' + resp.id);
                }
            },

            post_to_facebook = function (response) {
                mySpinner.show();
                var data = new FormData(),
                    req = new XMLHttpRequest();
                data.append('source', myPicture.get_blob());
                data.append('message', 'Die lichtstärkste Kamera aller Smartphones. Das Windows Phone Nokia Lumia 925 hat mein Foto deutlich verbessert!');
                data.append('access_token', response.authResponse.accessToken);

                req.open("POST", "https://graph.facebook.com/me/photos");
                req.send(data);
                req.addEventListener('load', did_finish_posting_to_facebook);
            },

            facebook_response_handler = function (response) {
                if (response.status === 'connected') {
                    post_to_facebook(response);
                } else if (response.status === 'not_authorized') {
                    FB.login(post_to_facebook, {scope: 'publish_actions,publish_stream,photo_upload,user_photos'});
                } else {
                    FB.login(post_to_facebook, {scope: 'publish_actions,publish_stream,photo_upload,user_photos'});
                }
            },

            did_choose_file = function (file) {
                myCTA.hide();
                mySpinner.show();
                myPicture.load_file(file);
            },

            did_press_button = function (button) {
                if (button === myFacebookButton) {
                    FB.getLoginStatus(facebook_response_handler);
                } else if (button === myBrightnessButton) {
                    myWandele.hide();
                    myWindows.show();
                    mySpinner.show();
                    myPicture.brighten(30);
                    myFacebookButton.set_enabled(true);
                }
            },

            did_load_image = function () {
                myImagePlaceholder.hide();
                mySpinner.hide();
                myPicture.show();
                myCameraInput.hide();
                myBrightnessButton.set_enabled(true);
                myWandele.show();
                myImagePlaceholder.show_phone();
            },

            will_start_brightening = function () {
                myBrightnessButton.set_enabled(false);
                mySpinner.show();
            },

            did_stop_brightening = function () {
                mySpinner.hide();
            },

            start = function () {
                myCameraInput.show();

                myFacebookButton.show();
                myFacebookButton.set_enabled(false);

                myBrightnessButton.show();
                myBrightnessButton.set_enabled(false);
            };

        that.will_start_brightening = will_start_brightening;
        that.did_stop_brightening = did_stop_brightening;
        that.myPicture = myPicture;
        that.facebook_response_handler = facebook_response_handler;
        that.did_load_image = did_load_image;
        that.did_choose_file = did_choose_file;
        that.did_choose_image = did_choose_image;
        that.did_press_button = did_press_button;
        that.start = start;
        return that;
    };

window.ad = ad();

window.addEventListener("load", function () {
    'use strict';

    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 100);

    document.getElementById('wrapper').style.minHeight = window.innerHeight + 'px';
    document.getElementById('picture').height = document.getElementById('phone-vert').clientHeight * retinaFactor + 100;

    window.addEventListener("touchstart", function (event) {
        if (event.target.id !== 'camera-input' && event.target.id !== 'facebook') {
            event.preventDefault();
        }
    });

    window.ad.start();
});
