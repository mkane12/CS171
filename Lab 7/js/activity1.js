
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);


// 1) INITIALIZE FORCE-LAYOUT
var force = d3.layout.force()
    .size([width, height]);


// Load data
d3.json("data/airports.json", function(data) {

    // 2a) DEFINE 'NODES' AND 'EDGES'
    force
        .nodes(data.nodes)
        .links(data.links)
        .charge(-100);
    // 2b) START RUNNING THE SIMULATION
    force.start();

    // 3) DRAW THE LINKS (SVG LINE)
    var edge = svg.selectAll(".link")
        .data(data.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);

    // 4) DRAW THE NODES (SVG CIRCLE)
    var node = svg.selectAll(".node")
        .data(data.nodes)
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
        .call(force.drag);

    // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    force.on("tick", function() {

        // Update node coordinates
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        // Update edge coordinates
        edge
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    });

    node
        .append("title")
        .text(function(d) { return d.name; });

});