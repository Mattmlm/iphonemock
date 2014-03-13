// trailsatellite.js
// trailmap.js


/* An InfoBox is like an info window, but it displays
 * under the marker, opens quicker, and has flexible styling.
 * @param {GLatLng} latlng Point to place bar at
 * @param {Map} map The map on which to display this InfoBox.
 * @param {Object} opts Passes configuration options - content,
 *   offsetVertical, offsetHorizontal, className, height, width
 */
function InfoBox(opts) {
  google.maps.OverlayView.call(this);
  this.latlng_ = opts.latlng;
  this.map_ = opts.map;
  this.offsetVertical_ = -180;
  this.offsetHorizontal_ = -165;
  this.height_ = 120;
  this.width_ = 260;
  this.content_ = opts.content;

  var me = this;
  this.boundsChangedListener_ =
    google.maps.event.addListener(this.map_, "bounds_changed", function() {
      return me.panMap.apply(me);
    });

  // Once the properties of this OverlayView are initialized, set its map so
  // that we can display it.  This will trigger calls to panes_changed and
  // draw.
  this.setMap(this.map_);
}

/* InfoBox extends GOverlay class from the Google Maps API
 */
InfoBox.prototype = new google.maps.OverlayView();

/* Creates the DIV representing this InfoBox
 */
InfoBox.prototype.remove = function() {
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

/* Redraw the Bar based on the current projection and zoom level
 */
InfoBox.prototype.draw = function() {
  // Creates the element if it doesn't exist already.
  this.createElement();
  if (!this.div_) return;

  // Calculate the DIV coordinates of two opposite corners of our bounds to
  // get the size and position of our Bar
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  if (!pixPosition) return;

  // Now position our DIV based on the DIV coordinates of our bounds
  this.div_.style.width = this.width_ + "px";
  this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
  this.div_.style.height = this.height_ + "px";
  this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
  this.div_.style.display = 'block';
};

/* Creates the DIV representing this InfoBox in the floatPane.  If the panes
 * object, retrieved by calling getPanes, is null, remove the element from the
 * DOM.  If the div exists, but its parent is not the floatPane, move the div
 * to the new pane.
 * Called from within draw.  Alternatively, this can be called specifically on
 * a panes_changed event.
 */
InfoBox.prototype.createElement = function() {
  var panes = this.getPanes();
  var div = this.div_;
  var content = this.content_;
  if (!div) {
    // This does not handle changing panes.  You can set the map to be null and
    // then reset the map to move the div.
    div = this.div_ = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = this.width_ + "px";
    div.style.height = this.height_ + "px";
    div.className = "trail-map-info-box"
    var contentDiv = document.createElement("div");
    contentDiv.className = "content"
    contentDiv.innerHTML = 
      "<div class='thumbnail-wrapper'>" +
        "<img class='thumbnail' src='" + this.content_.thumbnail + "'>" +
      "</div>" +
      "<div class='trail-map-description'>" +
        "<div class='title'>" + this.content_.title + "</div>" +
        "<div class='traillength'>" + this.content_.traillength + " trail</div>" +
        "<div class='rating rating-" + this.content_.rating + "'>" + this.content_.rating + "</div>" +
      "</div>"
      ;

    var topDiv = document.createElement("div");
    topDiv.style.textAlign = "right";
    var closeImg = document.createElement("img");
    closeImg.style.width = "32px";
    closeImg.style.height = "32px";
    closeImg.style.cursor = "pointer";
    closeImg.src = "http://gmaps-samples.googlecode.com/svn/trunk/images/closebigger.gif";
    topDiv.appendChild(closeImg);

    function removeInfoBox(ib) {
      return function() {
        ib.setMap(null);
      };
    }

    google.maps.event.addDomListener(closeImg, 'click', removeInfoBox(this));

    div.appendChild(topDiv);
    div.appendChild(contentDiv);
    div.style.display = 'none';
    panes.floatPane.appendChild(div);
    this.panMap();
  } else if (div.parentNode != panes.floatPane) {
    // The panes have changed.  Move the div.
    div.parentNode.removeChild(div);
    panes.floatPane.appendChild(div);
  } else {
    // The panes have not changed, so no need to create or move the div.
  }
}

/* Pan the map to fit the InfoBox.
 */
InfoBox.prototype.panMap = function() {
  // if we go beyond map, pan map
  var map = this.map_;
  var bounds = map.getBounds();
  if (!bounds) return;

  // The position of the infowindow
  var position = this.latlng_;

  // The dimension of the infowindow
  var iwWidth = this.width_;
  var iwHeight = this.height_;

  // The offset position of the infowindow
  var iwOffsetX = this.offsetHorizontal_;
  var iwOffsetY = this.offsetVertical_;

  // Padding on the infowindow
  var padX = 40;
  var padY = 40;

  // The degrees per pixel
  var mapDiv = map.getDiv();
  var mapWidth = mapDiv.offsetWidth;
  var mapHeight = mapDiv.offsetHeight;
  var boundsSpan = bounds.toSpan();
  var longSpan = boundsSpan.lng();
  var latSpan = boundsSpan.lat();
  var degPixelX = longSpan / mapWidth;
  var degPixelY = latSpan / mapHeight;

  // The bounds of the map
  var mapWestLng = bounds.getSouthWest().lng();
  var mapEastLng = bounds.getNorthEast().lng();
  var mapNorthLat = bounds.getNorthEast().lat();
  var mapSouthLat = bounds.getSouthWest().lat();

  // The bounds of the infowindow
  var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
  var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
  var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
  var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

  // calculate center shift
  var shiftLng =
      (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
      (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
  var shiftLat =
      (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
      (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

  // The center of the map
  var center = map.getCenter();

  // The new map center
  var centerX = center.lng() - shiftLng;
  var centerY = center.lat() - shiftLat;

  // center the map to the new shifted center
  map.setCenter(new google.maps.LatLng(centerY, centerX));

  // Remove the listener after panning is complete.
  google.maps.event.removeListener(this.boundsChangedListener_);
  this.boundsChangedListener_ = null;
};

function createMarker(coords, map, content) {
  var rating = "4"

  var marker = new google.maps.Marker({
    position: coords,
    map: map,
    icon: icon,
    title: content.title
  });

  google.maps.event.addListener(marker, "click", function(e) {
    window.infoBox = new InfoBox({latlng: marker.getPosition(), map: map, content: content});
  });

  // var marker = new google.maps.Marker({
  //   position: coords,
  //   map: map,
  //   title: title
  // });
  
  // var infowindow = new google.maps.InfoWindow({
  //   content: contentString
  // });
  
  // google.maps.event.addListener(marker, 'click', function() {

  //   infowindow.open(map,marker);
  // });
}

function initialize() {

  // Set up map
  var myOptions = {
    zoom: 17,
    center: new google.maps.LatLng(37.7477533551465, -119.59658311437227),
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  // google.maps.event.trigger(marker, "click");

  // Marker data
  var myLatLng = new google.maps.LatLng(37.746173,-119.596949);
  var foodIcon = new google.maps.MarkerImage("assets/images/foodIcon.png", null, null, null, new google.maps.Size(26, 26));

	var marker1 = new google.maps.Marker({
	  position: myLatLng,
	  map: map,
	  icon: foodIcon
	});

	var photoNoteLatLng1 = new google.maps.LatLng(37.746819,-119.59632);
	var cameraIcon = new google.maps.MarkerImage("assets/images/noteCamera.png", null, null, null, new google.maps.Size(26, 26));
	var marker2 = new google.maps.Marker({
	  position: photoNoteLatLng1,
	  map: map,
	  icon: cameraIcon
	});

	var latLng = new google.maps.LatLng(37.7477533551465, -119.59658311437227)
	var marker3 = new google.maps.Marker({
		position: latLng,
		map: map,
		icon: "assets/images/charmander_run__by_ai_ki_san-d4qa7um.gif",
		optimized: false
	});

	var photoNoteLatLng2 = new google.maps.LatLng(37.748415,-119.596511);
	var marker4 = new google.maps.Marker({
	  position: photoNoteLatLng2,
	  map: map,
	  icon: cameraIcon
	});

  google.maps.event.addListener(marker2, "click", function(e) {
    window.location = 'lower_falls_panoramic.html'
  });
  google.maps.event.addListener(marker4, "click", function(e) {
    window.location = 'lower_falls_panoramic.html'
  });

  google.maps.event.addListener(marker3, "click", function(e) {
    // window.location = 'http://fc05.deviantart.net/fs71/i/2013/070/8/5/t_rex_maw_by_fatthoron-d5xr8s1.jpg'
  });
  
}

if(parent.window) {
  parent.window.pageState = "Trail Map";
}