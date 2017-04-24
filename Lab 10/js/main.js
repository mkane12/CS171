// Start application by loading the data
loadData();

var allData, marriageData, businessData;


function loadData() {

    marriageData = [
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
        [0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0,0,0,1,0,1,0,0,0],
        [0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0]
    ];

    businessData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,0,0,1,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0],
        [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,0],
        [0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,1],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]
    ];

    d3.csv("data/florentine-family-attributes.csv", function(error, csv) {

        csv.forEach(function(d, index){

            d.Index = index;
            // calculate number of marriages/business ties
            var marriages = 0, businessTies = 0, allRelations = 0;
            for(var i = 0; i < csv.length; ++i){
                if(marriageData[index][i] == 1) {
                    marriages++;
                    allRelations++;
                }
                if(businessData[index][i] == 1) {
                    businessTies++;
                    allRelations++;
                }
            }
            d.marriages = marriages;
            d.businessTies = businessTies;
            d.allRelations = allRelations;

            d.marriageValues = marriageData[index];
            d.businessValues = businessData[index];

            // make numeric values numeric
            if (d.Priorates == 'NA') {
                d.Priorates = -1;
            }
            else {
                d.Priorates = +d.Priorates;
            }

            d.Wealth = +d.Wealth;

        });

        // Store csv data in global variable
        allData = csv;
        createVis();
    });

}


function createVis() {

    // TO-DO: INSTANTIATE VISUALIZATION
    var matrix = new Matrix("matrix-vis", allData);

}