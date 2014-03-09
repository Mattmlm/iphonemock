// footer.js

$(document).ready(function() {
	$('.footer-search').click(function() {
		$('#page-iframe').attr('src', 'search.html');
	});
	$('.footer-trailmap').click(function() {
		if(!(
			$('#page-iframe').attr('src') == 'trailgooglemap.html' ||
			$('#page-iframe').attr('src') == 'trailsatellite_lowerfalls.html'
			))

		$('#page-iframe').attr('src', 'trailsatellite_lowerfalls.html');
	});
	$('.footer-home').click(function() {
		window.location = 'menu.html';
	});
	$('.footer-tab').click(function() {
		$('.footer-tab').removeClass('active');
		$(this).addClass('active');
	});
});