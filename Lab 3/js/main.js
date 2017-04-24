/*
d3.select(".container")
    .append("p")
    .text("Dynamic Content");

var states = ["Connecticut", "Maine", "Massachusetts", "New Hampshire", "Rhode Island" , "Vermont"];

// Change the CSS property background (lightgray)
d3.select("body")
    .style("background-color", "#EEE");
// Append paragraphs and highlight one element
d3.select("body").selectAll("p")
    .data(states)
    .enter()
    .append("p")
    .text(function(d){
        return d;
    })
    .attr("class", "custom-paragraph")
    .style("color", "blue")
    .style("font-weight", function(d) {
        if(d == "Massachusetts")
            return "bold";
        else
            return "normal";
    });


var numericData = [1, 2, 4, 8, 16];
// Add svg element (drawing space)
var svg = d3.select("body")
    .append("svg")
    .attr("width", 300)
    .attr("height", 50);

// Add rectangle
svg.selectAll("rect")
    .data(numericData)
    .enter()
    .append("rect")
    .attr("fill", "red")
    .attr("width", 50)
    .attr("height", 50)
    .attr("y", 0)
    .attr("x", function(d, index) {
        return (index * 60);
    });

// Add svg element (drawing space)
svg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

var sandwiches = [
    { name: "Thesis", price: 7.95, size: "large" },
    { name: "Dissertation", price: 8.95, size: "large" },
    { name: "Highlander", price: 6.50, size: "small" },
    { name: "Just Tuna", price: 6.50, size: "small" },
    { name: "So-La", price: 7.95, size: "large" },
    { name: "Special", price: 12.50, size: "small" }
    ];

svg.selectAll("circle")
    .data(sandwiches)
    .enter()
    .append("circle")
    .attr("fill", function(d, index) {
        // cheap sandwich
        if (d.price < 7) {
            return "green";
        }
        // expensive sandwich
        else {
            return "orange";
        }
    })
    .attr("cy", "50")
    .attr("r", function(d, index) {
        if (d.size == "large") {
            return 20;
        }
        // size is small
        else {
            return 10;
        }
    })
    .attr("cx", function(d, index) {
        return (index * 50 + 25);
    })
    .attr("stroke", "black");
*/

var i = 0;
var cities = new Array();

// filter cities data to have only cities in the EU
d3.csv("data/cities.csv", function(data) {
    d3.select("body")
        .data(data)
        .enter()
        .append("p")
        .text(function(d){
            if(d.eu == "true") {
                // convert numerical values to numbers
                d.population = +d.population;
                d.x = +d.x;
                d.y = +d.y;
                // append EU city to array and update counter
                i = cities.push(d);
            }
        })

    // print number of EU cities
    d3.select(".container")
        .attr("class", "heading")
        .text("The number of cities in the EU is " + i);

    //Create the SVG Viewport
    var svgContainer = d3.select("body").append("svg")
        .attr("width",700)
        .attr("height",550);

    svgContainer.selectAll("circle")
        .data(cities)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })
        .attr("r", function(d) {
            if (d.population < 1000000) {
                return 4;
            }
            else {
                return 8;
            }
        })
        .style("fill", "purple");

    svgContainer.selectAll("text")
        .data(cities)
        .enter()
        .append("text")
        .attr("class", "city-label")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function (d) {
            return (d.y - 10);
        })
        .attr("opacity", function(d) {
            if (d.population <= 1000000) {
                return 0;
            }
        })
        .text(function(d) {
            return d.city;
        })

});