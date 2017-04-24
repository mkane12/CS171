
d3.select("body")
    .style("background-color", "beige");

// Load the data
d3.csv("data7238/buildings.csv", function(data) {
    //Create the svg space in first column
    var svg1 = d3.select(".chart-area").append("svg")
        .attr("width", 500)
        .attr("height", 700);

    console.log(data);

    // Sort descending by the 'Visitors' property
    var sortedBuildings = data.sort(function(a, b) {
        return b.height_ft - a.height_ft;
    });

    // draw rectangles
    var rectangles = svg1.selectAll("rect")
        .data(sortedBuildings)
        .enter()
        .append("rect")
        .attr("fill", "lightskyblue")
        .attr("width", function(d) {
            return d.height_px;
        })
        .attr("height", function(d) {
            return 40;
        })
        .attr("y", function(d, index) {
            return (index * 50);
        })
        .attr("x", 220);

    // label rectangles with building names
    var buildingLabels = svg1.selectAll("text.name")
        .data(sortedBuildings)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", 210)
        .attr("y", function (d, index) {
            return (index * 50 + 25);
        })
        .text(function(d) {
            return d.building;
        });

    // label inside rectangles with building heights
    svg1.selectAll("text.height")
        .data(sortedBuildings)
        .enter()
        .append("text")
        .attr("class", "height-label")
        .attr("fill", "white")
        .attr("x", function(d) {
            // make numeric
            d.height_px = +d.height_px;
            return (180 + d.height_px);
        })
        .attr("y", function (d, index) {
            return (index * 50 + 25);
        })
        .text(function(d) {
            return d.height_ft;
        });

    // if someone clicks on the rectangles
    rectangles.on("click", function(d, index) {
        printInfo(d);
    });

    // if someone clicks on the labels
    buildingLabels.on("click", function(d, index) {
        printInfo(d);
    });

    // function to print building info directly to HTML
    function printInfo(obj) {
        document.getElementById("building-name").innerHTML = obj.building;
        document.getElementById("height").innerHTML = "Height: " + obj.height_ft + " meters";
        document.getElementById("city").innerHTML = "Location: " + obj.city;
        document.getElementById("country").innerHTML = "Country: " + obj.country;
        document.getElementById("floors").innerHTML = "Number of floors: " + obj.floors;
        document.getElementById("year").innerHTML = "Year of completion: " + obj.completed;
        document.getElementById("pic").innerHTML = "<img src='data7238/img/" + obj.image + "' height='400' width='500'>";
    }
});