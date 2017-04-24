
// SVG Size
var width = 900,
		height = 500;


// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data){

	// Sort descending by the 'Population' property
	data = data.sort(function(a, b) {
		return b.Population - a.Population;
	});

	// create svg space in ID chart-area
	var svg = d3.select("#chart-area").append("svg")
		.attr("width", width)
		.attr("height", height);


	// Returns the min. and max. value in a given array
	var incomeExtent = d3.extent(data, function(d) {
		// make numeric value number
		d.Income = +d.Income;
		return d.Income;
	});

	// allow padding on axes
	var padding = 40;

	var incomeScale = d3.scale.log()
		.domain([incomeExtent[0] - 10, incomeExtent[1] + 10])
		.range([padding, width - padding]);

	// Returns the min. and max. value in a given array
	var lifeExpectancyExtent = d3.extent(data, function(d) {
		// make numeric value number
		d.LifeExpectancy = +d.LifeExpectancy;
		return d.LifeExpectancy;
	});

	var lifeExpectancyScale = d3.scale.linear()
		.domain([lifeExpectancyExtent[0] - 10, lifeExpectancyExtent[1] + 10])
		.range([height - padding, padding]);

	// min and max of populations
	var popExtent = d3.extent(data, function(d) {
		// make numeric value number
		d.Population = +d.Population;
		return d.Population;
	})

	// variable for radius of circles
	var linearRadius = d3.scale.linear()
		.domain([popExtent[0], popExtent[1]])
		.range([4, 30]);

	// variable for color of circles
	var linearColor = d3.scale.category10();
	linearColor.domain(data.map(function(d) {
			return d.Region;
		}));

	// draw circles
	var circles = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("fill", function(d) {
			return linearColor(d.Region);
		})
		.attr("stroke", "darkblue")
		.attr("r", function(d) {
			return linearRadius(d.Population);
		})
		.attr("cx", function(d) {
			return incomeScale(d.Income);
		})
		.attr("cy", function(d) {
			return lifeExpectancyScale(d.LifeExpectancy);
		});

	// variable to format numbers to be comma-grouped by thousands
	var commasFormatter = d3.format(",.0f");

	// Create a generic axis function
	var xAxis = d3.svg.axis()
		// Pass in the scale function
		.scale(incomeScale)
		// Specify orientation (top, bottom, left, right)
		.orient("bottom")
		.tickValues([1000, 2000, 4000, 8000, 32000, 100000])
		// specify tick format
		.tickFormat(function(d) {
			return commasFormatter(d);
		});

	// Draw the axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.call(xAxis)
		.attr("transform", "translate(10, 480)");

	// x-axis label
	svg.append("text")
		.attr("class", "axis-label x-label")
		.attr("x", width - 210)
		.attr("y", height - 25)
		.text("Income per Person (GDP per Capita)");


	// Create a generic axis function
	var yAxis = d3.svg.axis()
		// Pass in the scale function
		.scale(lifeExpectancyScale)
		// Specify orientation (top, bottom, left, right)
		.orient("left");

	// Draw the axis
	svg.append("g")
		.attr("class", "axis y-axis")
		.call(yAxis)
		.attr("transform", "translate(30, 0)");

	// y-axis label
	svg.append("text")
		.attr("class", "axis-label y-label")
		.attr("transform", "translate(45, 120), rotate(270)")
		.text("Life Expectancy");

	// Analyze the dataset in the web console
	//console.log(data);
	console.log("Countries: " + data.length);

	console.log(data);
});
