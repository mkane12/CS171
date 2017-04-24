// --> CREATE SVG DRAWING AREA
var width = 800,
    height = 600;

var mapSvg = d3.select("#map-area").append("svg")
    .attr("width", width)
    .attr("height", height);

var countries = mapSvg.append("svg:g")
    .attr("id", "countries");

// d3 mercator projection
var projection = d3.geo.mercator()
    .translate([width / 2, height / 2])
    .scale(300);

// generate geo path
var path = d3.geo.path()
    .projection(projection);

var dataByCountryId;
var africa;
var val = "UN_Population";
var colorScale;


// Use the Queue.js library to read two files
queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-water-sanitation-2015.csv")
  .await(function(error, mapTopJson, countryDataCSV){

      // --> PROCESS DATA
      // Convert TopoJSON to GeoJSON (target object = 'collection')
      africa = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;


      // make numeric data numeric
      for (var i = 0; i < countryDataCSV.length; i++) {
          countryDataCSV[i].Improved_Sanitation_2015 = +countryDataCSV[i].Improved_Sanitation_2015;
          countryDataCSV[i].Improved_Water_2015 = +countryDataCSV[i].Improved_Water_2015;
          countryDataCSV[i].UN_Population = +countryDataCSV[i].UN_Population;
          // remove data that is not African
          if (countryDataCSV[i].WHO_region != "African") {
              countryDataCSV.splice(i);
          }
      }

      // new object for data by country ID
      dataByCountryId = countryDataCSV.map(function(d) {
          return {
              name: d.Code,
              values: {Country: d.Country, Improved_Sanitation_2015: d.Improved_Sanitation_2015,
                      Improved_Water_2015: d.Improved_Water_2015, UN_Population: d.UN_Population}
          };
      });


      // Update choropleth
      updateChoropleth(val);
  });

// function to determine what category the user selected
function dataManipulation() {
    var box = document.getElementById("type");
    val = box.options[box.selectedIndex].value;
    // update domain of color scale

    updateChoropleth(val);
}

// function to get range of values based on user-selected category
function getExtent(val) {
    if (val == "UN_Population") {
        var extent = [0, 99999999]
    }
    else {
        var extent = [0, 100];
    }
    return extent;
}

// function to get new color scheme based on user-selected category
function getColorScheme(val) {
    if (val == "UN_Population") {
        var color = colorbrewer.Reds[9];
    }
    else if (val == "Improved_Sanitation_2015") {
        var color = colorbrewer.Purples[9];
    }
    else {
        var color = colorbrewer.Blues[9];
    }
    return color;
}


function updateChoropleth(val) {
    colorScale = d3.scale.quantize()
        .domain(getExtent(val))
        .range(getColorScheme(val));

    // create array of country codes in order
    var labels = [];
    for(var i = 0; i < dataByCountryId.length; i++) {
        labels.push(dataByCountryId[i].name);
    }

    mapSvg.selectAll(".country").remove();

    // Render Africa by using the path generator
    var country = mapSvg.selectAll("path")
        .data(africa)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", function(d) {
            var country = d.properties.adm0_a3_is;
            var index = labels.indexOf(country);
            // if value is defined
            if (index > -1 && dataByCountryId[index].values[val]) {
                return colorScale(dataByCountryId[index].values[val]);
            }
            else {
                return "gray";
            }
        })
        .append("title")
        .text(function(d) {
            return d.properties.name;
        });


    mapSvg.selectAll(".legendEntry").remove();

    // append legend
    var legend = mapSvg.selectAll('g.legendEntry')
        .data(colorScale.range())
        .enter().append('g')
        .attr('class', 'legendEntry');

    legend
        .append('rect')
        .attr("x", width - 190)
        .attr("y", function(d, i) {
            return i * 20 + 200;
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function(d){return d;});

    //the data objects are the fill colors
    legend
        .append('text')
        .attr("x", width - 400)
        .attr("y", function(d, i) {
            return i * 20 + 210;
        })
        .text(function(d,i) {
            var extent = colorScale.invertExtent(d);
            //extent will be a two-element array, format it however you want:
            var format = d3.format("0.2f");
            return format(+extent[0]) + " - " + format(+extent[1]);
        });

    // append undefined
    legend.append('rect')
        .attr("x", width - 190)
        .attr("y", 400)
        .attr("width", 10)
        .attr("height", 10)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", "gray");
    legend
        .append('text')
        .attr("x", width - 400)
        .attr("y", 410)
        .text("Undefined");
}