

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data				-- the dataset 'household characteristics'
 * @param _config			-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

BarChart = function(_parentElement, _data, _config){
	this.parentElement = _parentElement;
	this.data = _data;
	this.config = _config;
	this.displayData = _data;

	this.initVis();
}



/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

BarChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 40, left: 80 };

	vis.width = $("#bar-charts").width() - vis.margin.right - vis.margin.left,
		vis.height = 200 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales and axes
	vis.y = d3.scale.ordinal()
		.rangeRoundBands([0, vis.height], .1);

	vis.x = d3.scale.linear()
		.range([vis.margin.left, vis.width]);

	vis.yAxis = d3.svg.axis()
		.scale(vis.y)
		.orient("left");

	vis.svg.append("g")
		.attr("class", "y-axis axis")
		.attr("transform", "translate(" + vis.margin.left + ", 0)");

	vis.svg.append("text")
		.attr("class", "bar-title")
		.attr("x", vis.margin.left)
		.attr("y", -10)
		.text(vis.config.title);


	// (Filter, aggregate, modify data)
	vis.wrangleData();
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
	var vis = this;

	// (1) Group data by key variable (e.g. 'electricity') and count leaves
	// get count of surveys based on passed in key variable
	vis.count = d3.nest()
		.key(function(d) {
			return d[vis.config.key];
		})
		.rollup(function(leaves) { return leaves.length; })
		.entries(this.displayData);

	// (2) Sort columns descending
	vis.sortedCounts = vis.count.sort(function(a, b) {
		return b.values - a.values;
	});

	// Update the visualization
	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

BarChart.prototype.updateVis = function(){
	var vis = this;

	// (1) Update domains
	vis.y.domain(vis.sortedCounts.map(function(d) {
		return d.key;
	}));

	vis.x
		.domain([0, vis.sortedCounts[0].values])

	// (2) Draw rectangles
	// Data-join (rectangle now contains the update selection)
	var rect = vis.svg.selectAll("rect")
		.data(vis.sortedCounts);

	// Enter (initialize the newly added elements)
	rect.enter().append("rect")
		.attr("class", "bar");

	// Update (set the dynamic properties of the elements)
	rect
		.attr("fill", "steelblue")
		.transition()
		.duration(500)
		.attr("x", vis.margin.left)
		.attr("y", function(d) {
			return vis.y(d.key);
		})
		.attr("width", function(d) {
			return vis.x(d.values);
		})
		.attr("height", vis.y.rangeBand());

	// Exit
	rect.exit().remove();

	// label inside rectangles with values
	var label = vis.svg.selectAll(".label")
		.data(vis.sortedCounts);

	label
		.enter().append("text")
		.attr("class", "label");

	label
		.attr("fill", "white")
		.attr("x", function(d) {
			return vis.margin.left + 10;
		})
		.text(function(d) {
			return d.values;
		})
		.attr("y", function (d, index) {
			return vis.y(d.key) + 15;
		});

	// Exit
	label.exit().remove();

	// Update the y-axis
	vis.svg.select(".y-axis").call(vis.yAxis);
}



/*
 * Filter data when the user changes the selection
 * Example for brushRegion: 07/16/2016 to 07/28/2016
 */

BarChart.prototype.selectionChanged = function(brushRegion){
	var vis = this;

	// Filter data accordingly without changing the original data
	this.displayData = this.data.filter(function(el) {
		return (el.survey >= brushRegion[0] & el.survey <= brushRegion[1]);
	});

	// Update the visualization
	vis.wrangleData();
}
