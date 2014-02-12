function initiate_geolocation() {
	if (navigator.geolocation)
		navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors);
	else
	  jQuery("#geoinfo").html('Geolocation not supported.').addClass('error');
}
function handle_geolocation_query(position){
	var text = "Latitude: "  + position.coords.latitude  + "<br/>" +
             "Longitude: " + position.coords.longitude + "<br/>" +
             "Accuracy: "  + position.coords.accuracy  + "m<br/>" +
             "Time: " + new Date(position.timestamp);
  jQuery("#geoinfo").html(text).addClass('ok');
	var image_url = "http://maps.google.com/maps/api/staticmap?sensor=false&zoom=18&size=580x580&markers=color:blue|label:S|" +
                   position.coords.latitude + ',' + position.coords.longitude; /*  + "&language=de" center=" + position.coords.latitude + "," +
                   position.coords.longitude + "&*/
  jQuery("#map").html(
  	jQuery(document.createElement("div")).css({
			'backgroundImage': 'url('+image_url+')',
			'backgroundSize': '290px',
			'width': '290px',
			'height': '290px'
		})
  );
}
function handle_errors(error) {
	switch(error.code)  {
		case error.PERMISSION_DENIED: jQuery("#geoinfo").html("User did not share geolocation data.");
		break;

		case error.POSITION_UNAVAILABLE: jQuery("#geoinfo").html("Could not detect current position.");
		break;

		case error.TIMEOUT: jQuery("#geoinfo").html("Retrieving position timed out.");
		break;

		default: jQuery("#geoinfo").html("Unknown error.");
		break;
	}
	jQuery("#geoinfo").addClass('error');
}
//var watchId = navigator.geolocation.watchPosition(handle_geolocation_query);
