
var allData = [];

// Variable for the visualization instance
var stationMap;

// Start application by loading the data
loadData();


function loadData() {

    // Proxy url
	var proxy = 'http://michaeloppermann.com/proxy.php?format=xml&url=';

    // Hubway XML station feed
    var url = 'https://www.thehubway.com/data/stations/bikeStations.xml';

    // LOAD DATA
    $.getJSON(proxy + url, function(jsonData){

        // extract array of stations
        allData = jsonData.station;

        // make numeric variables numeric
        for (var i=0; i<allData.length; i++) {
            allData[i].id = +allData[i].id;
            allData[i].lat = +allData[i].lat;
            allData[i].long = +allData[i].long;
            allData[i].nbBikes = +allData[i].nbBikes;
            allData[i].nbEmptyDocks = +allData[i].nbEmptyDocks;
        }

        // print number of stations to station-count
        $("#station-count").text(allData.length);

        createVis();

    });

}


function createVis() {

    // TO-DO: INSTANTIATE VISUALIZATION
    var bostonMap = new StationMap("station-map", allData, [42.3521, -71.0552]);

}