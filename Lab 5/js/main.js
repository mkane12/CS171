
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 20};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Initialize data
loadData();

// Coffee chain data
var data;

// x and y scale
var x, y;

// x and y axes
var barXAxis, barYAxis;

// bars
var rect;

// initialize selected value as "stores"
var selVal = "stores";

// initialize maximum y value
var maxY;


// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv", function(error, csv) {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;

		initAxes();
    	// Draw the visualization for the first time with selected value "stores"
		updateVisualization(selVal);
	});
}

// function to calculate maximum y value
function getMaxY(selVal) {
	maxY = d3.max(data, function(d) {
		return d[selVal];
	});
	return maxY;
}

// function to initialize the axes
function initAxes(selVal) {
	// initialize x axis scale
	x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);
	// initialize y axis scale
	y = d3.scale.linear()
		.domain([0, getMaxY(selVal)])
		.range([height, 0]);

	// initialize x axis
	barXAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	// initialize y axis
	barYAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// Draw the x axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.call(barXAxis)
		.attr("transform", "translate(" + margin.left + "," + height + ")");

	// Draw the y axis
	svg.append("g")
		.attr("class", "axis y-axis")
		.call(barYAxis)
		.attr("transform", "translate(" + margin.left + ", 0)");

}

// function to determine what the selected value to group by is
function dataManipulation() {
	var selBox = document.getElementById("ranking-type");
	selVal = selBox.options[selBox.selectedIndex].value;
	console.log(selVal);
	// update visualization with new selected value
	updateVisualization(selVal);
}

// Render visualization
function updateVisualization(selVal) {
	// get max of selected value (y axis)
	maxY = d3.max(data, function(d) {
		return d[selVal];
	});

	// sort the data
	data.sort(function(a, b) {
		return b[selVal] - a[selVal];
	});

	// update domains
	x.domain(data.map(function(d) {
			return d.company;
	}));
	y.domain([0, maxY]);


	// Draw the x axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.call(barXAxis)
		.attr("transform", "translate(" + margin.left + "," + height + ")");

	// Draw the y axis
	svg.append("g")
		.attr("class", "axis y-axis")
		.call(barYAxis)
		.attr("transform", "translate(" + margin.left + ", 0)");

	// update axes
	svg.selectAll("g.y-axis")
		.transition()
		.duration(500)
		.call(barYAxis);
	svg.selectAll("g.x-axis")
		.transition()
		.duration(500)
		.call(barXAxis);

	// issues with exiting? How does that work?



	// DRAW BARS //
	// Data-join (rectangle now contains the update selection)
	rect = svg.selectAll("rect")
		.data(data);

	// Enter (initialize the newly added elements)
	rect.enter().append("rect")
		.attr("class", "bar");

	// Update (set the dynamic properties of the elements)
	rect
		.transition()
		.duration(500)
		.attr("x", function(d) {
			return x(d.company) + margin.left;
		})
		.attr("y", function(d) {
			return y(d[selVal]);
		})
		.attr("width", x.rangeBand())
		.attr("height", function(d) {
			return height - y(d[selVal]);
		});

	// Exit
	rect.exit().remove();


	console.log(data);

}