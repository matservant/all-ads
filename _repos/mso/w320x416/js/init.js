/**
*
* YOC Ad Plus - Microsoft - Office 20110 (2011)
*
* (c) 2011 - YOC AG (Björn Hampe)
*
**/

var tracking = false;

jQuery(document).ready(function(){
	if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/Firefox/i) || navigator.userAgent.match(/WebKit/i))!=null) {
		var viewport = jQuery('#viewport');
		var viewportWidth  = parseInt(viewport.width());
		var viewportHeight = parseInt(viewport.height());

		window.scrollTo(0,1);
		
		/*** show start loader ***/
		$(window).load( function() {
			window.scrollTo(0,1);

			jQuery('.page').css({opacity:1});
			jQuery('#viewport').fadeIn(250);

			$('.verticalSlider').yocPageSlider({
				controlActiveClass:"pageActive",
				controlInactiveClass:"pageInactive",
				controls:true,
				speed:"0.2s"
			});

			// $('#moreinfo').click(function(e) {
			// 	e.preventDefault();
			// 	
			// 	if(typeof(navigator.geolocation) != "undefined" && typeof(navigator.geolocation.getCurrentPosition) != "undefined") {
			// 		navigator.geolocation.getCurrentPosition(getPosition, geolocation_errors);
			// 	}else{
			// 		goToAlternativeMap(url);
			// 	}
			// 
			// 	function getPosition(position) {
			// 		url = 'http://maps.google.de/maps?z=12&t=m&q=loc:' + position.coords.latitude + '+' + position.coords.longitude;
			// 		window.location = url;
			// 	}
			// 
			// 	function geolocation_errors(error) {
			// 		if (_elem.attr('target') !== 'undefined' && _elem.attr('target') == '_blank')
			// 			window.open(url, "_blank");
			// 		else
			// 			window.location = url;
			// 	}
			// });

			// prevent viewport scrolling
			document.getElementById('viewport').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

		});
	}

});
