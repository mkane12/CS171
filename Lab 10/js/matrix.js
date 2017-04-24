
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

Matrix = function(_parentElement, _data) {

	this.parentElement = _parentElement;
	this.data = _data;


	this.initVis();
}


/*
 *  Initialize station map
 */

Matrix.prototype.initVis = function() {
	var vis = this;

	vis.margin = {top: 40, right: 10, bottom: 60, left: 20};

	vis.width = 960 - vis.margin.left - vis.margin.right;
	vis.height = 500 - vis.margin.top - vis.margin.bottom;

	// DRAW SVG //
	vis.svg = d3.select('#' + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	var row = vis.svg.selectAll(".row")
		.attr("class", "row")
		.data(vis.data, function(d){
			return d.Family;
		});

	console.log(vis.data);

	row.enter().append("text")
		.attr("class", "label")
		.text(vis.data, function(d) {
			console.log(d.Family);
			return d.Family;
		});





	// DRAW TRIANGLES //
	vis.cellHeight = 20;
	vis.cellWidth = 20;
	vis.cellPadding = 10;




	vis.updateVis();
}


/*
 *  The drawing function
 */

Matrix.prototype.updateVis = function() {

	var vis = this;



}
