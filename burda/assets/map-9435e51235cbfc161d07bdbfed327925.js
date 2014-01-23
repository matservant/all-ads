        $(document).ready(function() {
            var headerPairImageNumber = Math.floor(Math.random() * 4) + 1;
            $('#headerPair').attr('src', 'img/header_pair_' + headerPairImageNumber + '.png');
            
            $('area').mouseover(function() {
                var selector = '#dfm' + $(this).attr('rel');
                $('.docfinderMap').hide().removeClass('current');
                $(selector).show().addClass('current');
            });

            $('.docfinderMap').mouseout(function() {
                $('.docfinderMap').hide().removeClass('current');
                $('#dfmdefault').show().addClass('current');
            });
        });
