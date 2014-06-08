function gotFSforInit(fileSystem) {
    fileSystem.root.getFile("data.json", null, gotFileEntryforInit, failInit);
}

function gotFileEntryforInit(fileEntry) {
    fileEntry.file(gotFileforInit, fail);
}

function gotFileforInit(file){
    readAsTextInit(file);
}
   
function readAsTextInit(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {

        var temp = evt.target.result;
        // var chartData = temp.substr(1);
        var chartData = temp;
        // var temp = JSON.parse('[' + chartData + ']');
        var temp2 = JSON.parse(chartData);
        globeData = temp2;
        var temp3 = [];
            
        var Allafterbloodsugar = 0;
        var Allbeforebloodsugar = 0;
        var count = 0;
        for(var i =0;i<temp2.length;i++) {
            var tempWithdate = {};
            if(temp2[i].hasOwnProperty('bloodsugar')) count++;
                
            var countBefore = 0;
            var countAfter = 0;
            tempWithdate.date = temp2[i].date;
            for(var j =0;j<temp2[i].bloodsugar.length;j++){
                                        
                if(temp2[i].bloodsugar[j].hasOwnProperty('afterbloodsugar') ) {
                    countAfter++;
                    Allafterbloodsugar+=temp2[i].bloodsugar[j].afterbloodsugar; 
                }
                else if(temp2[i].bloodsugar[j].hasOwnProperty('beforebloodsugar') ){
                    countBefore++;
                    Allbeforebloodsugar+=temp2[i].bloodsugar[j].beforebloodsugar;
                }

            }
            tempWithdate.beforebloodsugar = parseInt(Allbeforebloodsugar/countBefore,10);
            tempWithdate.afterbloodsugar = parseInt(Allafterbloodsugar/countAfter,10);
            temp3.push(tempWithdate);

        }

        for(var i =0;i<temp3.length;i++){
            temp3[i].dateForchart = AmCharts.stringToDate(temp3[i].date, "YYYY-M-DD");

        }

        chartData2 = temp3;
        // SERIAL CHART    
        chart.marginTop = 0;
        chart.autoMarginOffset = 5;
        chart.pathToImages = "js/amcharts/images/";
        chart.zoomOutButton = {
            backgroundColor: '#0000ff',
            backgroundAlpha: 0
        };

        chart.dataProvider = chartData2;
        chart.categoryField = "dateForchart";
        chart.dataDateFormat = "YYYY-MM-DD";
        // AXES
        // category                
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.dashLength = 0;
        categoryAxis.gridAlpha = 0;
        categoryAxis.axisColor = "#000000";

        // value axis
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.axisColor = "#000000";
        valueAxis.axisThickness = 1;
        valueAxis.gridAlpha = 0;
        valueAxis.axisAlpha = 1;
        chart.addValueAxis(valueAxis);

        // GRAPHS
        // first graph
        var graph1 = new AmCharts.AmGraph();
        graph1.title = "餐前";
        graph1.valueField = "beforebloodsugar";
        graph1.bullet = "round";
        graph1.hideBulletsCount = 100;
        chart.addGraph(graph1);

        // second graph                
        var graph2 = new AmCharts.AmGraph();
        graph2.title = "餐後";
        graph2.fillAlphas = 0;
        // graph2.fillToGraph = graph1; // this here we specify which graph object to fill to
        graph2.valueField = "afterbloodsugar";
        graph2.bullet = "square";
        graph2.hideBulletsCount = 300;
        chart.addGraph(graph2);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chartCursor.pan = true;
        chart.addChartCursor(chartCursor);

        // SCROLLBAR
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        chart.addLegend(legend);
       
    }    
    reader.readAsText(file);
}

function failInit(error){
    // alert("init fail");
    $('#chart .error').css('display','block');
}
