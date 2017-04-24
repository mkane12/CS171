var width = 1000,
    height = 600;

var svg = d3.select("#map-area").append("svg")
    .attr("width", width)
    .attr("height", height);

// d3 mercator projection
var projection = d3.geo.mercator()
    .translate([width / 2, height / 2])
    .scale(100);

// generate geo path
var path = d3.geo.path()
    .projection(projection);

// Load data parallel
queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.json, "data/airports.json")
    .await(createVisualization);


// Load data
function createVisualization(error, mapData, airportData) {

    // Convert TopoJSON to GeoJSON (target object = 'countries')
    console.log(mapData);
    var usa = topojson.feature(mapData, mapData.objects.countries).features;

    console.log(usa);

    // Render the U.S. by using the path generator
    svg.selectAll("path")
        .data(usa)
        .enter().append("path")
        .attr("d", path)
        .attr('fill', "steelblue");

    // DRAW THE NODES (SVG CIRCLE)
    var node = svg.selectAll(".node")
        .data(airportData.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", function(d) {
            if (d.country == "United States") {
                return "blue";
            }
            else {
                return "red";
            }
        })
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
        });

    node
        .append("title")
        .text(function(d) { return d.name; });

}