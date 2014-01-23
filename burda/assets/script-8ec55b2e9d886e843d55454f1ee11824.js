$(function(){
	console.log('running');
	$(document).pjax('a', '#pjax-container')
	$("#time").text(new Date())
});
