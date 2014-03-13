// header.js

function updateTitle() {
	var pageTitle = $('.header-page-title');
	if(pageTitle.text() != window.pageState) {
		pageTitle.text(window.pageState);
	}
}
$(document).ready(function() {
	window.pageState = "Search";
	setInterval(updateTitle, 100);
	$('.header-back-button').click(function() {
		window.history.back();
	});
	$('.header-search').click(function() {
		$('.header-search-bar').toggleClass("active");
	})
	$('.header-search-input').keyup(function () {
		if(this.value.length != 0) {
			// $('#page-iframe').contents().find('[href="#' + this.value[0].toUpperCase() + '-header"]').click();
			$('#page-iframe').contents().find('.trail-category').hide();
			$('#page-iframe').contents().find('.' + this.value[0].toUpperCase() + '-trails').show();
		} else {
			$('#page-iframe').contents().find('.trail-category').show();
		}
	});
});