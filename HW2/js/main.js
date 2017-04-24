

// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

createVisualization("All", "all");

function createVisualization(area, order) {
	delData = deliveryData;
	feedData = feedbackData;

	// area is not all
	if (area != "All") {
		delData = deliveryData.filter(function(el) {
			return (el.area === area);
		});

		feedData = feedData.filter(function(o) {
			return delData.some(function(o2) {
				return o.delivery_id === o2.delivery_id;
			})
		});
	}


	// order is not all
	if (order != "all") {
		delData = delData.filter(function(el) {
			return (el.order_type === order);
		});

		feedData = feedData.filter(function(o) {
			return delData.some(function(o2) {
				return o.delivery_id === o2.delivery_id;
			})
		});
	}

	console.log(feedData);

	renderBarChart(delData);

	delData = getDelData(delData);
	document.getElementById("delData").innerHTML = "Number of deliveries: " + delData[0] + "<br />";
	document.getElementById("delData").innerHTML += "Total number of pizzas delivered: " + delData[1] + "<br />";
	document.getElementById("delData").innerHTML += "Average delivery time: " + delData[2] + " minutes <br />";
	document.getElementById("delData").innerHTML += "Total sales: $" + delData[3];

	feedData = getFeedData(feedData);
	document.getElementById("feedData").innerHTML = "Number of feedback entries: " + feedData[0] + "<br />";
	document.getElementById("feedData").innerHTML += "Number of low feedback entries: " + feedData[1] + "<br />";
	document.getElementById("feedData").innerHTML += "Number of medium feedback entries: " + feedData[2] + "<br />";
	document.getElementById("feedData").innerHTML += "Number of high feedback entries: " + feedData[3];

}

// function to determine what area and order typeuser selected
function dataManipulation() {
	var areaBox = document.getElementById("area-type");
	var areaVal = areaBox.options[areaBox.selectedIndex].value;

	var orderBox = document.getElementById("order-type");
	var orderVal = orderBox.options[orderBox.selectedIndex].value;
	createVisualization(areaVal, orderVal);
}

// function for getting relevant values from deliveryData
function getDelData(data) {
	//  variable for the number of pizza deliveries
	var numDel = data.length;

	// begin count for number of delivered pizzas
	var numPizzas = 0;

	// begin summation of delivery times
	var sumDelTime = 0;

	// begin count for sales
	var sales = 0;

	// iterate through deliveryData
	for(i=0; i < data.length; i++) {
		// add number of pizzas delivered to pizza count
		numPizzas += data[i].count;
		// add value to sum of all delivery times
		sumDelTime += data[i].delivery_time;
		// add value to total sales
		sales += data[i].price;
	}

	// variable for average delivery time
	var avgDelTime = sumDelTime/numDel;

	// return an array containing the number of deliveries, number of pizzas, average delivery time, and sales
	return [numDel, numPizzas, avgDelTime.toFixed(2), sales.toFixed(2)];
}

// function for getting relevant values from feedbackData
function getFeedData(data) {
	// variable for the number of feedback entries
	var numFeedback = data.length;

	// variables for the number of feedback entries that are low/medium/high
	var numLow = 0;
	var numMed = 0;
	var numHigh = 0;

	// loop through feedbackData
	for (i=0; i<data.length; i++) {
		// feedback quality is low
		if (data[i].quality == "low") {
			numLow += 1;
		}
		// feedback quality is medium
		else if (data[i].quality == "medium") {
			numMed += 1;
		}
		// feedback quality is high
		else {
			numHigh +=1;
		}

	}

	// return an array containing the number of feedback entries, and number of low, medium, and high entries
	return [numFeedback, numLow, numMed, numHigh];
}