// main.js

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

jQuery(document).ready(function() {
	console.log("testing main");

	// var page = getParameterByName("page");
	// if(page == "search") {
	// 	jQuery('#page-iframe').attr('src', 'search.html');
	// }
	// if(page == "trailmap") {
	// 	jQuery('#page-iframe').attr('src', 'trailgooglemap.html');
	// }
	// if(page == "settings") {
	// 	jQuery('#page-iframe').attr('src', 'settings.html');
	// }
});