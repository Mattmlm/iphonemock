// header.js

$(document).ready(function() {
	$('.header-back-button').click(function() {
		window.history.back();
	});
	$('.header-search').click(function() {
		$('.header-search-bar').toggleClass("active");
	})
});