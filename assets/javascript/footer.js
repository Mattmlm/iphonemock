// footer.js

$(document).ready(function() {
	$('.footer-search').click(function() {
		window.pageState = "Search"
		$('#page-iframe').attr('src', 'search.html');
	});
	$('.footer-trailmap').click(function() {
		window.pageState = "Trail Map"
		if(!(
			$('#page-iframe').attr('src') == 'trailgooglemap.html' ||
			$('#page-iframe').attr('src') == 'trailsatellite_lowerfalls.html'
			))

		$('#page-iframe').attr('src', 'trailsatellite_lowerfalls.html');
	});
	$('.footer-home').click(function() {
		window.location = 'menu.html';
	});
	$('.footer-favorites').click(function() {
		window.pageState = "Favorites"
	});
	$('.footer-settings').click(function() {
		window.pageState = "Settings"
	});

	$('.footer-tab').click(function() {
		$('.footer-tab').removeClass('active');
		$(this).addClass('active');
	});
});