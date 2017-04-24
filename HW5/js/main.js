// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");


// Initialize data
loadData();

// FIFA world cup
var data;

// x and y scale
var x, y;

// x and y axes
var xAxis, yAxis;

// selected value
var selVal = "GOALS";

// range of x-axis
var extentX;
// maximum of y-axis values
var maxY;

// initialize line for line graph
var line;
// initialize circles for line graph
var circles;

// initialize start and end dates
var startDate = formatDate.parse("1930");
var endDate = formatDate.parse("2014");

// Load CSV file
function loadData() {
		d3.csv("data/fifa-world-cup.csv", function(error, csv) {

		csv.forEach(function(d){
			// Convert string to 'date object'
			d.YEAR = formatDate.parse(d.YEAR);
			
			// Convert numeric values to 'numbers'
			d.TEAMS = +d.TEAMS;
			d.MATCHES = +d.MATCHES;
			d.GOALS = +d.GOALS;
			d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
			d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
		});

		// Store csv data in global variable
		data = csv;

		console.log(data);

		// initialize the axes
		initAxes();

		// Draw the visualization for the first time
		updateVisualization(selVal, startDate, endDate);

	});
}


// get the min and max x-axis value
function getExtentX() {
	extentX = d3.extent(data, function(d) {
		return d.YEAR;
	});
	return extentX;
}

// get the maximum Y value based on the selected value
function getMaxY(selVal) {
	maxY = d3.max(data, function(d) {
		return d[selVal];
	});
	return maxY;
}


// function to initialize the axes
function initAxes() {
	// initialize x axis scale
	x = d3.time.scale()
		.domain([getExtentX()[0], getExtentX()[1]])
		.range([0, width - margin.right]);
	// initialize y axis scale
	y = d3.scale.linear()
		.domain([0, getMaxY(selVal)])
		.range([height, 0]);

	// initialize x axis
	xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	// initialize y axis
	yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// Draw the x axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.call(xAxis)
		.attr("transform", "translate(" + margin.left + "," + height + ")");
	// Draw the y axis
	svg.append("g")
		.attr("class", "axis y-axis")
		.call(yAxis)
		.attr("transform", "translate(" + margin.left + ", 0)");

}

// function to determine what the selected value for the y-axis
function dataManipulation() {
	var selBox = document.getElementById("category");
	selVal = selBox.options[selBox.selectedIndex].value;
	console.log(selVal);
	// update visualization with new selected value
	updateVisualization(selVal, startDate, endDate);
}

// function to update x-axis with dates
function dateChange(start, end) {
	// make strings into date objects
	startDate = formatDate.parse(start);
	endDate = formatDate.parse(end);

	updateVisualization(selVal, startDate, endDate);

}

// Render visualization --> takes user-selected value as input
function updateVisualization(selected, startDate, endDate) {

	// update x-domain
	x.domain([startDate, endDate]);
	// Draw the x-axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.call(xAxis)
		.attr("transform", "translate(" + margin.left + ", " + height + ")");
	// update x-axis
	svg.selectAll("g.x-axis")
		.transition()
		.duration(500)
		.call(xAxis);

	// update y-domain
	y.domain([0, getMaxY(selected)]);
	// Draw the y-axis
	svg.append("g")
		.attr("class", "axis y-axis")
		.call(yAxis)
		.attr("transform", "translate(" + margin.left + ", 0)");
	// update y-axis
	svg.selectAll("g.y-axis")
		.transition()
		.duration(500)
		.call(yAxis);

	// cut off visualization at edges of graph
	// define the clipPath for the line
	svg.append("clipPath")       // define a clip path
		.attr("id", "lineBounds") // give the clipPath an ID
		.append("rect")          // shape it as a rectangle
		.attr("width", width)
		.attr("height", height + margin.top)
		.attr("transform", "translate(0, " + -margin.top + ")");
	// define the clipPath for the circles
	svg.append("clipPath")
		.attr("id", "circleBounds") // give the clipPath an ID
		.append("rect")          // shape it as a rectangle
		.attr("width", width)
		.attr("height", height + margin.top)
		.attr("transform", "translate(" + margin.left + ", " + -margin.top + ")");

	// DRAW LINE //
	svg.selectAll(".line").remove();
	line = d3.svg.line()
		.x(function(d) {
			return x(d.YEAR);
		})
		.y(function(d) {
			return y(d[selected]);
		})
		.interpolate("linear");

	var linegraph = svg.append("path")
		.datum(data);

	linegraph
		.transition()
		.duration(800)
		.attr("clip-path", "url(#lineBounds)") // clip the line
		.attr("class", "line")
		.attr("d", line)
		.attr("transform", "translate(" + margin.left + ", 0)");

	// APPEND POINTS //
	// Data-join (circle now contains the update selection)
	circles = svg.selectAll("circle")
		.data(data);

	// Enter (initialize the newly added elements)
	circles.enter().append("circle")
		.attr("class", "dot");

	// Update (set the dynamic properties of the elements)
	circles
		.transition()
		.duration(800)
		.attr("clip-path", "url(#circleBounds)") // clip the circles
		.attr("stroke", "#1C9A3D")
		.attr("cx", function(d) {
			return x(d.YEAR) + margin.left;
		})
		.attr("cy", function(d) {
			return y(d[selected]);
		})
		.attr("r", 3)
		.attr("fill", "none");

	// Exit
	circles.exit().remove();


	// CREATE TOOLTIP //
	svg.selectAll(".d3-tip").remove();
	// Initialize tooltip
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.html(function(d) {
			console.log(d);
			return "<strong>" + selected + ":</strong> <span style='color:lawngreen'>" + d[selected] + "</span>";
		});
	// Invoke the tip in the context of your visualization
	svg.call(tip);

	svg.selectAll('dot')
		.data(data)
		.enter()
		.append('circle')
		.attr("cx", function(d) {
			return x(d.YEAR) + margin.left;
		})
		.attr("cy", function(d) {
			return y(d[selected]) - 10;
		})
		.attr("r", 10)
		.style("fill", "white")
		.style("opacity", 0.01)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	var clickCircles = svg.selectAll("dot")
		.data(data)
		.enter()
		.append('circle')
		.attr("cx", function(d) {
			return x(d.YEAR) + margin.left;
		})
		.attr("cy", function(d) {
			return y(d[selected]);
		})
		.attr("r", 10)
		.style("fill", "white")
		.style("opacity", 0.01);

	// if someone clicks on one of the circles
	clickCircles.on("click", function(d) {
		showEdition(d);
	});
}

// Show details for a specific FIFA World Cup
function showEdition(d){
	document.getElementById("edition").innerHTML = d.EDITION;
	document.getElementById("location").innerHTML = "Location: " + d.LOCATION;
	document.getElementById("winner").innerHTML = "Winner: " + d.WINNER;
	document.getElementById("num-goals").innerHTML = "Number of Goals: " + d.GOALS;
	document.getElementById("avg-num-goals").innerHTML = "Average Number of Goals: " + d.AVERAGE_GOALS;
	document.getElementById("num-matches").innerHTML = "Number of Matches: " + d.MATCHES;
	document.getElementById("num-teams").innerHTML = "Number of Teams: " + d.TEAMS;
	document.getElementById("avg-attend").innerHTML = "Average Attendance: " + d.AVERAGE_ATTENDANCE;
}
