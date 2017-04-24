
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

var x = d3.time.scale()
	.range([0, width]);

var y = d3.scale.linear()
	.range([height, 0]);

// Initialize data
loadData();

// FIFA world cup
var data;

// initialize default filter values for years
var year_filter_low = formatDate.parse("0");
var year_filter_high = formatDate.parse("2500");


// Initialize axes and axis labels
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var xAxisGroup = svg.append("g")
	.attr("class", "x-axis axis")
	.attr("transform", "translate(0, " + height + ")")
	.style("font-size", "10px");

var yAxisGroup = svg.append("g")
	.attr("class", "y-axis axis")
	.style("font-size", "10px");

var xlabel = svg.append("text")
	.attr("id", "x-label")
	.text("")

var ylabel = svg.append("text")
	.attr("id", "y-label")
	.text("")


// When datatype is changed, update visualization
d3.select("#data-type").on("change", updateVisualization);

/* Initialize tooltip */
var selectBox_area = document.getElementById("data-type");
var selected = selectBox_area.options[selectBox_area.selectedIndex].value;

var tip = d3.tip().attr('class', 'd3-tip')
	.offset([-8,0])
	.html(function (d) {
		return d.EDITION + "</br>" + convert_variable_string(selected) + ": " + d[selected];
	});

/* Invoke the tip in the context of your visualization */
svg.call(tip);

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


		// Add a slider to the page using the minimum and maximum years appearing in the data
		var slider = document.getElementById('slider');

		slidermin = parseInt(formatDate(d3.min(data, function(d) {return d.YEAR})));
		slidermax = parseInt(formatDate(d3.max(data, function(d) {return d.YEAR})));
		console.log(slidermin);
		console.log(slidermax);
		noUiSlider.create(slider, {
			start: [slidermin, slidermax],
			connect: true,
			step: 1,
			range: {
				'min': slidermin,
				'max': slidermax
			}

		});

		// Dynamically update what the user has selected for the slider value
		var directionField1 = document.getElementById('field1');
		var directionField2 = document.getElementById('field2');

		slider.noUiSlider.on('update', function( values, handle ){
			directionField1.innerHTML = "Lower Limit: " + values[0].substring(0, values[0].length - 3);
			directionField2.innerHTML = "Upper Limit: " + values[1].substring(0, values[1].length - 3);
		});

		// Add a listener to the slider submit button -- when selected, the current values of the slider should be
		// used as the filter ranges and the visualization should be updated with that filter
		document.getElementById('slider-submit-button').addEventListener('click', function(){
			var years = slider.noUiSlider.get();
			year_filter_low = formatDate.parse(years[0].substring(0, years[0].length - 3));
			year_filter_high  = formatDate.parse(years[1].substring(0, years[1].length - 3));
			updateVisualization();
		});

		// Draw the visualization for the first time
		updateVisualization();
	});
}


// Render visualization
function updateVisualization() {

	// filter data by years (either based on initialization or updated slider values)
	filtered_data = data.filter(function (el) {return el.YEAR >= year_filter_low && el.YEAR <= year_filter_high});

	// identify which data attribute is selected
	selectBox_area = document.getElementById("data-type");
	selected = selectBox_area.options[selectBox_area.selectedIndex].value;


	// set domains of scales
	x.domain(d3.extent(filtered_data, function(d) {return d.YEAR}));
	y.domain([0,d3.max(filtered_data, function(d) {return d[selected]})]);



	// LINE GRAPH
	var datafn = d3.svg.line()
		.x(function(d) { return x(d.YEAR); })
		.y(function(d) { return y(d[selected]); })
		.interpolate("linear");


	var dataline = svg.selectAll("path")
		.data(filtered_data);

	dataline.enter().append("path")
		.attr("class", "line");

	dataline
		.transition()
		.duration(800)
		.attr("d", datafn(filtered_data));

	dataline.exit().remove();



	// UPDATE AXES AND LABELS
	svg.select(".x-axis")
		.transition()
		.duration(800)
		.call(xAxis);

	svg.select(".y-axis")
		.transition()
		.duration(800)
		.call(yAxis);

	ylabel
		.text(convert_variable_string(selected))
		.attr("x",0 - (height / 2))
		.attr("y", 15 -margin.left)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "middle");

	xlabel
		.text("Year")
		.attr("x", width/2) //5 + timeScale(endDatum.date))
		.attr("y", height + margin.top); //5 + populationScale(endDatum.population)-15);


	// LINE GRAPH CIRCLES

	var data_circles = svg.selectAll("circle")
		.data(filtered_data);


	data_circles.enter().append("circle")
		.attr("class", "tooltip-circle")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.on('click', function(d){
			showEdition(d)
		});

	data_circles
		.transition()
		.duration(800)
		.attr("cx", function(d) { return x(d.YEAR); })
		.attr("cy", function(d) { return y(d[selected]); })
		.attr("r", 5);

	data_circles.exit().remove();
}



// Converts a string to sentence case for display purposes
function convert_variable_string(s) {
	s = s.replace("_", " ");
	s = s.toLowerCase();
	s = s.charAt(0).toUpperCase() + s.slice(1)
	return s;
}



// Show details for a specific FIFA World Cup
function showEdition(d){

	var table_contents = ""

	// Loop through attributes of the data object, adding the name to the left column and value to right column
	keys = Object.keys(d)
	for (i = 0; i < keys.length; i++) {
		if (typeof(d[keys[i]]) == "object") // if it's a date object, convert it back to a string
			table_contents += "<tr><td class='table-row'>" + convert_variable_string(keys[i]) +  "</td><td>" + formatDate(d[keys[i]]) + "</td></tr>" ;
		else
			table_contents += "<tr><td class='table-row'>" + convert_variable_string(keys[i]) +  "</td><td>" + d[keys[i]] + "</td></tr>" ;
	}

	var toPrintTable = "<table id='edition-table'> " + table_contents + "</table>";

	document.getElementById("edition-info").innerHTML = toPrintTable;
}

