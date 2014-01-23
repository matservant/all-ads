var comicStripIntervalObject = null;
var comicStripIntervalTimeInMs = 12000;
    
$(document).ready(function() {
    var headerPairImageNumber = Math.floor(Math.random() * 4) + 1;
    $('#headerPair').attr('src', 'img/header_pair_' + headerPairImageNumber + '.png');
    
    comicStripInit();
});

function comicStripInit() {
    $('.comicStrip .controls a').click(function() {
        comicStripClick($(this).index());
    });
    comicStripClick(0);
}

function comicStripClick(index) {
    $('.comicStrip .controls a').removeClass('active');
    $('.comicStrip .controls a').eq(index).addClass('active');
    $('.comicStrip .images img').hide();
    $('.comicStrip .images img').eq(index).show();
    
    comicStripIntervalStart();
}

function comicStripNextImage() {
    var nextIndex = 0;
    var currentIndex = $('.comicStrip .controls a.active').index();
    if (currentIndex < $('.comicStrip .controls a').length - 1) {
        nextIndex = currentIndex + 1;
    }
    comicStripClick(nextIndex);
}

function comicStripIntervalStart() {
    window.clearInterval(comicStripIntervalObject);
    comicStripIntervalObject = null;
    comicStripIntervalObject = window.setInterval('comicStripNextImage()', comicStripIntervalTimeInMs);
}
;
