
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {

	this.parentElement = _parentElement;
	this.data = _data;

	this.mapPosition = _mapPosition;


	this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
	var vis = this;

	vis.map = L.map(this.parentElement).setView(this.mapPosition, 14);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; ' +
	'<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'})
		.addTo(vis.map);

	// data for MBTA Lines
	$.getJSON('http://www.cs171.org/2016/assets/scripts/lab9/MBTA-Lines.json', function(data) {
		var lines = L.geoJson(data, {
			style: styleLine,
			weight: 5,
		}).addTo(vis.map);

		function styleLine(feature) {
			switch (feature.properties.LINE) {
				case 'ORANGE': return { color: "#e67e22" };
				case 'RED': return { color: "#c0392b" };
				case 'BLUE': return { color: "#2980b9" };
				case 'GREEN': return { color: "#27ae60" };
				case 'SILVER': return { color: "#7f8c8d" };
			}
		}

	});

	vis.wrangleData();
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {

	var vis = this;

	// If the images are in the directory "/img":
	L.Icon.Default.imagePath = 'img/';

	// Add empty layer groups for the markers / map objects
	var bikeStations = L.layerGroup().addTo(vis.map);

	$.each(vis.data, function(i, station) {

		// create popup content
		var popupContent = "<strong>" + station.name + "</strong><br/>";
		popupContent += "Available bikes: " + station.nbBikes + "<br/>";
		popupContent += "Available docks: " + station.nbEmptyDocks;

		// create marker
		var marker = L.marker([station.lat, station.long])
			.bindPopup(popupContent)
			.addTo(vis.map);

		// Add marker to layer group
		bikeStations.addLayer(marker);
	});



}
