
/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */

AreaChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = [];

	this.initVis();
}


/*
 * Initialize visualization (static content; e.g. SVG area, axes, brush component)
 */

AreaChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = {top: 20, right: 50, bottom: 20, left: 50};

	// Width and height as the inner dimensions of the area chart area
	vis.width = $("#area-chart").width() - vis.margin.right,
		vis.height = 500 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#area-chart").append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// (Filter, aggregate, modify data)
	vis.wrangleData();

	// Scales and axes
	vis.x = d3.time.scale()
		.range([vis.margin.left, vis.width])
		.domain([d3.min(vis.sortedCounts, function(d) {
			return new Date(d.key);
		}),
			d3.max(vis.sortedCounts, function(d) {
				return new Date(d.key);
			})]);

	vis.y = d3.scale.linear()
		.range([vis.height, 0])
		.domain([0, d3.max(vis.sortedCounts, function(d) { return d.values; })]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("bottom")
		.ticks(3);

	vis.yAxis = d3.svg.axis()
		.scale(vis.y)
		.orient("left");

	// (2) Draw area
	vis.area = d3.svg.area()
		.x(function(d) {
			return vis.x(new Date(d.key));
		})
		.y0(vis.height)
		.y1(function(d) {
			return vis.y(d.values);
		});

	// draw area
	vis.svg.append("path")
		.datum(vis.sortedCounts)
		.attr("class", "area")
		.attr("d", vis.area)
		.attr("fill", "steelblue");

	// Initialize brush component
	vis.brush = d3.svg.brush()
		.x(vis.x)
		.on("brush", brushed);

	// Append brush component here
	vis.svg.append("g")
		.attr("class", "x brush")
		.call(vis.brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", vis.height + 7);

	// draw axes
	vis.svg.append("g")
		.attr("class", "x-axis axis")
		.attr("transform", "translate(0, " + vis.height + ")");

	vis.svg.append("g")
		.attr("class", "y-axis axis")
		.attr("transform", "translate(" + vis.margin.left + ", 0)");

	// Update the visualization
	vis.updateVis();
}


/*
 * Data wrangling
 */

AreaChart.prototype.wrangleData = function(){
	var vis = this;

	// (1) Group data by date and count survey results for each day
	// get counts of surveys by date
	vis.count = d3.nest()
		.key(function(d) {
			return d.survey;
		})
		.rollup(function(leaves) { return leaves.length; })
		.entries(vis.data);

	console.log(vis.count);

	// (2) Sort data by day
	vis.sortedCounts = vis.count.sort(function(a, b) {
		return new Date(a.key) - new Date(b.key);
	});
}


/*
 * The drawing function
 */

AreaChart.prototype.updateVis = function(){
	var vis = this;

	// Update the axes
	vis.svg.select(".x-axis").call(vis.xAxis);
	vis.svg.select(".y-axis").call(vis.yAxis);
}

