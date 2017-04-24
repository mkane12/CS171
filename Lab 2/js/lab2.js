
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

function dataFiltering(category) {

	var attractions = [];

	// category is all
	if (category === "all") {
		attractions = attractionData;
	}
	// category is not all
	else {
		attractions = attractionData.filter(function(el) {
			return (el.Category === category);
		});
	}


	// Sort descending by the 'Visitors' property
	var sortedAttractions = attractions.sort(function(a, b) {
		return b.Visitors - a.Visitors;
	});

	// Filter into array of top 5 attractions
	var topFive = sortedAttractions.filter(function(value, index) {
		return (index < 5);
	});

	renderBarChart(topFive);
}

dataFiltering("all");

function dataManipulation() {

	var selectBox = document.getElementById("attraction-category");
	var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	dataFiltering(selectedValue);

}