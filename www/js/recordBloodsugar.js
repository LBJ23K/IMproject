$(document).ready(function(){

        function onChange() {
            var datepicker = $("#calendar").data("kendoDatePicker").value();

            datepickerDate = datepicker.getFullYear() + '-'+(datepicker.getMonth()+1)+'-'+(datepicker.getDate() );

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSforRead, fail );
        }

        function onChange2() {
            var today = new Date();

            datepickerDate = today.getFullYear() + '-'+(today.getMonth()+1)+'-'+(today.getDate() );

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSforRead, fail );
        }
        $("#calendar").kendoDatePicker({
            change: onChange
        });
        var currentDate = new Date();  

        var bloodsugarRecordList = [];
        $('#bloodSugar td').click(function(){
            $('#bloodSugar td').each(function(){
                $(this).removeClass('active');
            });
            $(this).addClass('active');
        });
        


        $('#bloodSugar .submit').click(function(){

            var bloodsugarData = {};
            var bloodsugarDataWithdate = {};
            var bloodsugar = parseInt( $('#bloodSugar .bloodSugar_input').val() );
            var mealType = $('#bloodSugar td.active').text();
            var comment = $('#bloodSugar textarea').val();

            if(mealType.substr(2,1)=='前') {
                bloodsugarData.beforebloodsugar = bloodsugar;
            }
            else {
                bloodsugarData.afterbloodsugar = bloodsugar;
            }
            bloodsugarData.value = bloodsugar;
            bloodsugarData.mealtype = mealType;
            bloodsugarData.comment = comment;
            var newDate = new Date();
            $.extend(bloodsugarDataWithdate,bloodsugarData);

            var newDate2 = newDate.getFullYear() + '-'+(newDate.getMonth()+1)+'-'+(newDate.getDate() );
            bloodsugarDataWithdate.date = newDate2;

            if(globeData.length == 0 ){
                data.date = newDate2;
                data.medicine = [];
                data.bloodsugar = [];
                data.bloodsugar.push( bloodsugarData );
                data.diet = [];
                globeData.push( data );
            }
            else {
            var found = false;
                for(var i =globeData.length-1;i >= 0;i--){
                    if(globeData[i].date == newDate2){
                        if( globeData[i].hasOwnProperty("bloodsugar") ) globeData[i].bloodsugar.push(bloodsugarData);
                        else{
                        globeData[i].bloodsugar = [];
                        globeData[i].bloodsugar.push(bloodsugarData);
                        }
                    found = true;
                    break;
                }
            if(!found){
                data.date = newDate2;
                data.medicine = [];
                data.bloodsugar = [];
                data.bloodsugar.push( bloodsugarData );
                data.diet = [];
                globeData.push( data );
                }    
                
            }
           
        }

        console.log(globeData);

        $.blockUI({ css: { 

            border: 'none', 
            padding: '5px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: '0.5',
            color: '#fff' 
            },
            message:"<h2>Processing...</h2>"
        
        }); 

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSforWrite, fail );
        // checkChartData(bloodsugarDataWithdate);
        clearBloodsugarRecord();
        window.open("index.html#recordHome");
    });
    
    $('#bloodSugar .reset').click(function() {
        clearBloodsugarRecord();
    });
});


    function gotFSforWrite(fileSystem) {
        fileSystem.root.getFile("data.json", {create: true, exclusive: false}, gotFileEntryforWrite, fail);
    }

    function gotFileEntryforWrite(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            $.blockUI({ css: { 
            border: 'none', 
            padding: '5px', 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            color: '#fff' 
            },
            message:"<h2>Finish!!</h2>"
        
            }); 
            setTimeout($.unblockUI, 2000);
            if( $('#chart .error').css('display') == 'block'){
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSforInit, fail);
                $('#chart .error').css('display','none');
            }
            else{
                
            }
            check();
            //onChange2();
        }

        writer.write( JSON.stringify(globeData) );
    }

    function fail(error) {
        console.log(error.code);
        // alert('fail'+error.code);

    }

    function gotFSforRead(fileSystem) {
        fileSystem.root.getFile("data.json", null, gotFileEntryforRead, fail);
    }

    function gotFileEntryforRead(fileEntry) {
        fileEntry.file(gotFileforRead, fail);
    }

    function gotFileforRead(file){
        readAsText(file);
    }

    function readAsText(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            $('#history .history-list').html('');
            var temp = evt.target.result;

            var histroyData = JSON.parse(temp);
            var i=0;

            for(i;i<histroyData.length;i++){

                if(histroyData[i].date == datepickerDate ) {
                    break;
                }
            }
            var bsLength = ( (histroyData[i].bloodsugar).length )-1;
            var medLength = ( (histroyData[i].medicine).length ) -1;
            var dietLength = ( (histroyData[i].diet).length ) -1;

            if(bsLength+1 > 0 ){
                $('#history .history-list ').append('<li class="km-group-container"><div class="km-group-title"><div class="km-text"><span style="font-size:25px;">血糖</span></div></div>');
                for(var j=0;j<=bsLength;j++)
                {
                    $('#history .history-list ').append('<ul class="km-list"><li>血糖值： <span class="value" >'+histroyData[i].bloodsugar[j].value+'</span></li><li>餐別：<span class="value">'+histroyData[i].bloodsugar[j].mealtype+'</span></li><li>備註：<br/><span class="comment">'+histroyData[i].bloodsugar[j].comment+'</span></li></ul>');
                }
                $('#history .history-list ').append('</li>');

            }
            if(dietLength+1 > 0 ){
                $('#history .history-list ').append('<li class="km-group-container"><div class="km-group-title"><div class="km-text"><span style="font-size:25px;">飲食</span></div></div>');
                for(var j=0;j<=dietLength;j++)
                {
                    $('#history .history-list ').append('<ul class="km-list"><li><img class="history-img" src="'+histroyData[i].diet[dietLength].imgPath+'"/><span class="img-des">'+datepickerDate+'</span></li><li>吃了： <span class="value" >'+histroyData[i].diet[dietLength].foodType+'</span></li><li>餐別：<span class="value">'+histroyData[i].diet[dietLength].mealtype+'</span></li><li>備註：<br/><span class="comment">'+histroyData[i].diet[dietLength].comment+'</span></li></ul>');
                }
                $('#history .history-list ').append('</li>');
            }
            if(medLength+1 > 0 ){
                $('#history .history-list ').append('<li class="km-group-container"><div class="km-group-title"><div class="km-text"><span style="font-size:25px;">藥物</span></div></div>');
                for(var j=0;j<=medLength;j++)
                {
                    $('#history .history-list ').append('<ul class="km-list"><li><img class="history-img" src="'+histroyData[i].medicine[medLength].imgPath+'"/><span class="img-des">'+datepickerDate+'</span></li><li>藥物：<span class="value" >'+histroyData[i].medicine[medLength].medname+'</li>'+'<li>餐別：<span class="value">'+histroyData[i].medicine[medLength].mealtype+'</span></li></ul>');
                }
                $('#history .history-list ').append('</li>');
            }
        }
        reader.readAsText(file);
    }
    function checkChartData(dataObject){
        // alert('in');
        var found = false;
        alert(JSON.stringify(dataObject) );
        for(var i =0;i<chartData2.length;i++){
            if(chartData2[i].date == dataObject.date ){
                found = true;
                if(chartData2[i].hasOwnProperty('beforebloodsugar') && dataObject.hasOwnProperty('beforebloodsugar') ) {
                    chartData2[i].beforebloodsugar = parseInt( (chartData2[i].beforebloodsugar+dataObject.hasOwnProperty('beforebloodsugar'))/2 )
                }
                else if(chartData2[i].hasOwnProperty('afterbloodsugar') && dataObject.hasOwnProperty('afterbloodsugar') ) {
                    chartData2[i].beforebloodsugar = parseInt( (chartData2[i].beforebloodsugar+dataObject.hasOwnProperty('beforebloodsugar'))/2 )
                }
            }
    
        }
        if(found==false) {
            alert('push');

            chartData2.push(dataObject);
        }
        chart.dataProvider = chartData2;
            chart.validateData();
            chart.write('chartdiv');

    }


function clearBloodsugarRecord() {
    $('#bloodSugar td').each(function() {
        $(this).removeClass('active');
    });
    document.getElementById("bloodsugarText").value = "";
    document.getElementById("bloodsugarValue").value = "";
}

