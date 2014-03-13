// settings.js

jQuery(document).ready(function() {
	$('.distance-button').on("click", function() {
		$('.distance-button').removeClass("active");
		$(this).addClass("active");
	});
});