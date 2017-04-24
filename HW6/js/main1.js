// Area chart configurations
var areaMargin = {top: 20, right: 50, bottom: 20, left: 50};

// Width and height as the inner dimensions of the area chart area
var areaWidth = 500 - areaMargin.left - areaMargin.right,
	areaHeight = 500 - areaMargin.top - areaMargin.bottom;

var areaSvg = d3.select("#area-chart").append("svg")
	.attr("width", areaWidth + areaMargin.left + areaMargin.right)
	.attr("height", areaHeight + areaMargin.top + areaMargin.bottom)
	.append("g")
	.attr("transform", "translate(" + areaMargin.left + "," + areaMargin.top + ")");



// Bar chart configurations
var barMargin = {top: 20, right: 10, bottom: 20, left: 10};

// Width and height as the inner dimensions of the bar chart area
var barWidth = 400 - barMargin.left - barMargin.right,
	barHeight = 800 - barMargin.top - barMargin.bottom;

var barSvg = d3.select("#bar-charts").append("svg")
	.attr("width", barWidth + barMargin.left + barMargin.right)
	.attr("height", barHeight + barMargin.top + barMargin.bottom)
	.append("g")
	.attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");


// Bar chart configurations: data keys and chart titles
var configs = [
	{ key: "ownrent", title: "Own or Rent" },
	{ key: "electricity", title: "Electricity" },
	{ key: "latrine", title: "Latrine" },
	{ key: "hohreligion", title: "Religion" }
];


// Initialize variables to save the charts later
var barcharts = [];
var areachart;

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y-%m-%d").parse;

// (1) Load CSV data
d3.csv("data/household_characteristics.csv", function(data){

	// (2) Convert strings to date objects
	// variable for date format
	var format = d3.time.format("%Y-%m-%d");

	var bisectDate = d3.bisector(function(d) {
		console.log(d.survey);
		return d.survey;
	})
		.left;

	// make dates into date objects
	for (i = 0; i < data.length; i++) {
		data[i].survey = format.parse(data[i].survey);
	}



	// get counts of surveys by date
	var countSurveysByDate = d3.nest()
		.key(function(d) {
			return d.survey;
		})
		.rollup(function(leaves) { return leaves.length; })
		.entries(data);

	// get extent of dates (x-axis area chart)
	var dateExtent = d3.extent(data, function(d) {
		return d.survey;
	});
	// get extent of number of surveys per date (y-axis area chart)
	var surveyExtent = d3.extent(countSurveysByDate, function(d) {
		return d.values;
	})

	// scale for dates
	var dateScale = d3.time.scale()
		.domain([dateExtent[0], dateExtent[1]])
		.range([areaMargin.left, areaWidth - areaMargin.right]);
	// scale for number of surveys per date
	var surveyScale = d3.scale.linear()
		.domain([0, surveyExtent[1]])
		.range([areaHeight, 0]);

	// areaXAxis
	var areaXAxis = d3.svg.axis()
	// Pass in the scale function
		.scale(dateScale)
		// Specify orientation (top, bottom, left, right)
		.orient("bottom");
	// areaYAxis
	var areaYAxis = d3.svg.axis()
		.scale(surveyScale)
		.orient("left");

	// Draw the areaXAxis
	areaSvg.append("g")
		.attr("class", "axis x-axis")
		.call(areaXAxis)
		.attr("transform", "translate(" + areaMargin.left + ", " + areaHeight + ")");
	areaSvg.append("g")
		.attr("class", "axis y-axis")
		.call(areaYAxis)
		.attr("transform", "translate(" + areaMargin.left + ", 0)");


	//console.log(data);
	
});


// React to 'brushed' event and update all bar charts
function brushed() {
	
	// * TO-DO *

}
