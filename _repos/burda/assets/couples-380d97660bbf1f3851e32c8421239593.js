/*jslint browser: true, devel: true*/
/*global $*/


$(document).ready(function() {
	var a = [
			'/assets/header_pair_1-bed4ec37b0fb4a65b1d1a3e2539ecbb4.png',
			'/assets/header_pair_2-daa5bf40a2cb9e4a6f68ac57acbb2c3f.png',
			'/assets/header_pair_3-6801cdc0c31d1afcd66c81ba9e8b62fa.png',
			'/assets/header_pair_4-d7c237068427d164d204b300203208ec.png'
		],
		n = Math.floor(Math.random() * a.length);
		src = a[n];

	$('#people').attr('src', src);
});
