// allow padding on axes
var padding = 30;

// Load CSV file
d3.csv("data/zaatari-refugee-camp-population.csv", function(data) {

    // variable for date format
    var format = d3.time.format("%Y-%m-%d");

    var bisectDate = d3.bisector(function(d) {
        return d.date;
    })
        .left;

    for (i = 0; i < data.length; i++) {
        // make dates into date objects
        data[i].date = format.parse(data[i].date);
        // make populations into numeric values
        data[i].population = +data[i].population;
    }

    // Margin object with properties for the four directions
    var margin = {top: 20, right: 10, bottom: 20, left: 10};

    // Width and height as the inner dimensions of the chart area
    var width = 670 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    var svg = d3.select("#area-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Returns the min. and max. value of dates
    var dateExtent = d3.extent(data, function(d) {
        return d.date;
    });

    // scale for dates
    var dateScale = d3.time.scale()
        .domain([dateExtent[0], dateExtent[1]])
        .range([padding, width - padding]);

    // Returns the min. and max. value of population
    var popExtent = d3.extent(data, function(d) {
        return d.population;
    });

    // scale for population
    var popScale = d3.time.scale()
        .domain([0, popExtent[1]])
        .range([height - padding, padding])
        .nice();



    // xAxis
    var xAxis = d3.svg.axis()
    // Pass in the scale function
        .scale(dateScale)
        // Specify orientation (top, bottom, left, right)
        .orient("bottom")
        .tickFormat(d3.time.format("%B %Y"));

    // Draw the xAxis
    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", "translate(" + margin.left + ", " + (height - padding) + ")")
        // rotate tick labels
        .selectAll("text")
            .attr("class", "x-label")
            .attr("transform", "rotate(-10)");

    // variable to format numbers to be comma-grouped by thousands
    var commasFormatter = d3.format(",.0f");

    // yAxis
    var yAxis = d3.svg.axis()
    // Pass in the scale function
        .scale(popScale)
        // Specify orientation (top, bottom, left, right)
        .orient("left")
        .tickFormat(function(d) {
            return commasFormatter(d);
        });

    // Draw the yAxis
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .attr("transform", "translate(" + (margin.left + padding) + ", 0)");


    var area = d3.svg.area()
        .x(function(d) {
            return dateScale(d.date);
        })
        .y0(height)
        .y1(function(d) {
            return popScale(d.population) + padding;
        });

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr("transform", "translate(" + (margin.left) + ", " + (-padding) + ")");


    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) {
            return (dateScale(d.date) + margin.left);
        })
        .y(function(d) {
            return (popScale(d.population) - padding);
        });

    var focus = svg.append("g")
        .style("display", "none");

    // append line at intersection
    focus.append("line")
        .attr("class", "y");

    // append text label at the intersection
    focus.append("text")
        .attr("class", "y")
        .attr("id", "label");


    function mousemove() {
        var x0 = dateScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus.select("line.y")
            .attr("x1", dateScale(d.date) + margin.left)
            .attr("y1", 0)
            .attr("x2", dateScale(d.date) + margin.left)  //<<== and here
            .attr("y2", height - padding)
            .style("stroke-width", 2)
            .style("stroke", "#824106")
            .style("fill", "none");

        // get x coordinate for tooltip label
        function getX(date) {
            // value for middle date
            midDate = data[140].date;
            // date is past midDate
            if (date > midDate) {
                return dateScale(date) - 110;
            }
            else {
                return dateScale(date) + 20;
            }
        }

        focus.select("text.y")
            .attr("transform",
                "translate(" + (getX(d.date)) + "," +
                (margin.top) + ")")
            .text(d3.time.format("%Y-%m-%d")(d.date) + ": " + d.population)
            .attr("id", "label");
    }

    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() {
            focus.style("display", null);
        })
        .on("mouseout", function() {
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);


    console.log(data);

});



// new margins for bar chart
var barMargin = {top: 20, right: 10, bottom: 20, left: 10};

// Width and height as the inner dimensions of the bar chart area
var barWidth = 400 - barMargin.left - barMargin.right,
    barHeight = 500 - barMargin.top - barMargin.bottom;


// Define 'svg' as a child-element (g) from the drawing area and include spaces
var barSvg = d3.select("#bar-chart").append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

// variable for types of shelters
var shelterData = [
    { type: 'Caravan', percentage: '0.7968' },
    { type: 'Combination', percentage: '0.1081' },
    { type: 'Tent', percentage: '0.0951' }
];

// variable for rectangle height - proportional to percent value
function getRect(dataPoint) {
    return ((dataPoint.percentage) * (barHeight - padding));
}

// variable for bar chart rectangles
// draw rectangles
var rectangles = barSvg.selectAll("rect")
    .data(shelterData)
    .enter()
    .append("rect")
    .attr("fill", "#c09653")
    .attr("width", 80)
    .attr("height", function(d) {
        return (getRect(d));
    })
    .attr("x", function(d, index) {
        return (index * 130 + padding);
    })
    .attr("y", function(d) {
         return (barHeight - getRect(d) - padding);
    });

// label rectangles with percentages
var rectLabels = barSvg.selectAll("text.name")
    .data(shelterData)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function(d, index) {
        return (index * 130 + padding + 20);
    })
    .attr("y", function (d) {
        return barHeight - barMargin.top - barMargin.bottom - getRect(d);
    })
    .text(function(d) {
        return (d3.format(".2%")(d.percentage));
    });



// Create an ordinal scale function
var barXScale = d3.scale.ordinal()
    .domain(["Caravans", "Combination", "Tents"])
    .rangeBands([0, barWidth - padding]); // D3 fits n (=4) bands within this interval

// barXAxis
var barXAxis = d3.svg.axis()
// Pass in the scale function
    .scale(barXScale)
    // Specify orientation (top, bottom, left, right)
    .orient("bottom");

// Draw the barXAxis
barSvg.append("g")
    .attr("class", "axis x-axis")
    .call(barXAxis)
    .attr("transform", "translate(" + padding + ", " + (barHeight - padding) + ")");

// Returns the min. and max. value of dates
var percentExtent = d3.extent(shelterData, function(d) {
    return d.percentage;
});

// scale for dates
var percentScale = d3.scale.linear()
    .domain([0, 1])
    .range([barHeight - padding, 0]);

// format percent for barYAxis
var formatPercent = d3.format(".0%");

// barYAxis
var barYAxis = d3.svg.axis()
// Pass in the scale function
    .scale(percentScale)
    // Specify orientation (top, bottom, left, right)
    .orient("left")
    .ticks(10)
    .tickFormat(formatPercent);

// Draw the barYAxis
barSvg.append("g")
    .attr("class", "axis y-axis")
    .call(barYAxis)
    .attr("transform", "translate(" + (padding) + ", 0)");