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
	var bisectDate = d3.bisector(function(d) {
		return d.survey;
	})
		.left;

	// make dates into date objects
	for (i = 0; i < data.length; i++) {
		data[i].survey = parseDate(data[i].survey);
	}

	// (3) Create new bar chart objects
	for (var i = 0; i < configs.length; i++) {
		barcharts[i] = new BarChart("bar-charts", data, configs[i]);
	}

	// (4) Create new area chart object
	areachart = new AreaChart("area-chart", data);
	
});


// React to 'brushed' event and update all bar charts
function brushed() {

	// React to 'brushed' event
	var selArea = areachart.brush.extent();
	// set new domains for bar charts
	for (var i = 0; i < barcharts.length; i++) {
		barcharts[i].selectionChanged(selArea);
	}


	// Update focus chart (detailed information)
	areachart.wrangleData();

}
