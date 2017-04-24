
/*
 * CountVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

CountVis = function(_parentElement, _data, _MyEventHandler){
	this.parentElement = _parentElement;
	this.data = _data;
	this.MyEventHandler = _MyEventHandler;

	this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

CountVis.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
	vis.height = 300 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


	// Scales and axes
	vis.x = d3.time.scale()
		.range([0, vis.width])
		.domain(d3.extent(vis.data, function(d) { return d.Year; }));

	vis.y = d3.scale.linear()
		.range([vis.height, 0]);

	vis.xAxis = d3.svg.axis()
			.scale(vis.x)
			.orient("bottom");

	vis.yAxis = d3.svg.axis()
			.scale(vis.y)
			.ticks(6)
			.orient("left");


	// Set domains
	var minMaxY= [0, d3.max(vis.data.map(function(d){ return d.count; }))];
	vis.y.domain(minMaxY);

	var minMaxX = d3.extent(vis.data.map(function(d){ return d.time; }));
	vis.x.domain(minMaxX);


	vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

	vis.svg.append("g")
			.attr("class", "y-axis axis");

	// Axis title
	vis.svg.append("text")
			.attr("x", -50)
			.attr("y", -8)
			.text("Votes");


	// Time label
	vis.label = vis.svg.append("text")
		.attr("x", vis.margin.right)
		.attr("y", -30)
		.attr("id", "datespan")
		.text(minMaxX[0].getUTCFullYear() + "-" + (minMaxX[0].getUTCMonth()+1) + "-" + minMaxX[0].getUTCDate()
			+ " - " + minMaxX[1].getUTCFullYear() + "-" + (minMaxX[1].getUTCMonth()+1) + "-" + minMaxX[1].getUTCDate());


	// Append a path for the area function, so that it is later behind the brush overlay
	vis.timePath = vis.svg.append("path")
			.attr("class", "area area-time");

	// Define the D3 path generator
	vis.area = d3.svg.area()
		.x(function(d) { return vis.x(d.time); })
		.y0(vis.height)
		.y1(function(d) { return vis.y(d.count); });
	 
	vis.area.interpolate("step");


	// Initialize brushing component
	vis.brush = d3.svg.brush()
		.x(vis.x);


	// Append brush component here
	vis.svg.append("g")
		.attr("class", "brush");

	// Call brush
	vis.svg.select(".brush").call(vis.brush)
		.selectAll('rect')
		.attr("height", vis.height);


	// initialize current brush extent
	vis.currentBrushRegion = null;

	// Call brush component here
	vis.brush.on("brush", function(){
		if(vis.brush.empty()) {
			// No region selected (brush inactive)
			$(vis.MyEventHandler).trigger("selectionChanged", vis.x.domain());
		} else {
			// User selected specific region
			vis.currentBrushRegion = vis.brush.extent();
			$(vis.MyEventHandler).trigger("selectionChanged", vis.brush.extent());
			vis.onSelectionChange(vis.brush.extent());
		}
	});

	// Initialize the zoom component
	vis.zoom = d3.behavior.zoom()
		// Subsequently, you can listen to all zooming events
		.on("zoom", function(){
			if (vis.currentBrushRegion) {
				vis.brush.extent(vis.currentBrushRegion);
			}
			vis.updateVis();
		})
		// Specify the zoom scale's allowed range
		.scaleExtent([1,20]);

	// Specify an x-scale for the zoom
	// The domain gets automatically adjusted when zooming
	vis.zoom.x(vis.x);

	vis.svg.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", vis.width)
		.attr("height", vis.height);


	// (Filter, aggregate, modify data)
	vis.wrangleData();
}



/*
 * Data wrangling
 */

CountVis.prototype.wrangleData = function(){
	var vis = this;

	this.displayData = this.data;

	// Update the visualization
	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

CountVis.prototype.updateVis = function(){
	var vis = this;


	// Call the area function and update the path
	// D3 uses each data point and passes it to the area function.
	// The area function translates the data into positions on the path in the SVG.
	vis.timePath
			.datum(vis.displayData)
			.attr("d", vis.area)
			.attr("clip-path", "url(#clip)");

	vis.svg.select(".brush").call(vis.brush)
		.selectAll("rect")
		.attr("height", vis.height)
		.attr("clip-path", "url(#clip)")
		.call(vis.zoom)
			.on("mousedown.zoom", null)
			.on("touchstart.zoom", null);


	// Call axis functions with the new domain 
	vis.svg.select(".x-axis").call(vis.xAxis);
	vis.svg.select(".y-axis").call(vis.yAxis);
}

CountVis.prototype.onSelectionChange = function(selectionStart, selectionEnd) {
	var vis = this;


	vis.label
		.attr("x", vis.margin.right)
		.attr("y", -30)
		.attr("id", "datespan")
		.text(selectionStart.getUTCFullYear() + "-" + (selectionStart.getUTCMonth()+1) + "-" + selectionStart.getUTCDate()
			+ " - " + selectionEnd.getUTCFullYear() + "-" + (selectionEnd.getUTCMonth()+1) + "-" + selectionEnd.getUTCDate());
}