// 此函式檢查今天是否有吃藥
function check() {

    // 檢查結果(boolean), initialize to false
      

    // device APIs are available
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, medGotFS, medFail);
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, bloodsugarGotFS, medFail);

    function medGotFS(fileSystem) {
        fileSystem.root.getFile("medicine.json", null, medGotFileEntry, medFail);
    }

    function medGotFileEntry(fileEntry) {
        fileEntry.file(medGotFile, medFail);
    }

    function medGotFile(file) {
        checkMedAsText(file);
    }

    // 檢查今天是否有吃過藥
    function checkMedAsText(file) {
        // alert('end');
        var result = false; 
        var reader = new FileReader();
        // 今天的年月日
        var thisYear = new Date().getFullYear();
        var thisMonth = new Date().getMonth() + 1; // 0 ~ 11
        var thisDay = new Date().getDate();

        reader.onloadend = function(evt) {

            var medData = JSON.parse(evt.target.result);
            // length of medData

            var dataLength = medData.length;
            // check
            var i = dataLength-1;
            for (; i >= 0 ; i--) 
            {
                if( medData[i].year === thisYear && medData[i].month === thisMonth && medData[i].day === thisDay)
                {
                    result = true;
                    break;   
                }
            }

            // 結果為真, X -> V
            if( result === true ){
                // $('.fa.fa-times:eq(1)').attr('class','fa fa-check');
                $('#home .medicineList').css('background-color','#66FF66');
                $('#home .medicineList').html('<i class="fa fa-check"></i>藥物'+
                    '<ul>'+'<li>時間: '+medData[i].time+'</li>'+
                    '<li>藥物: '+medData[i].name+'</li>'+'</ul>');
                $('#home .medicineList').click(function(){
                    $(this).children('ul').slideToggle();
                })

            }
        }
        reader.readAsText(file);
    }
    function medFail(error) {
        console.log(error.code);
    }    

    function bloodsugarGotFS(fileSystem) {
        fileSystem.root.getFile("data.json", null, bloodsugarGotFileEntry, medFail);
    }

    function bloodsugarGotFileEntry(fileEntry) {
        fileEntry.file(bloodsugarGotFile, medFail);
    }
    function bloodsugarGotFile(file) {
        checkBloodsugar(file);
    }
    function checkBloodsugar(file){
        var reader = new FileReader();
        
        reader.onloadend = function(evt) {

            var result = false; 
            
            // 今天的年月日
            var thisYear = new Date().getFullYear();
            var thisMonth = new Date().getMonth() + 1; // 0 ~ 11
            var thisDay = new Date().getDate();
            if(thisMonth<10){
                thisMonth = '0'+thisMonth;
            }
            if(thisDay<10){
                thisDay = '0'+thisDay;
            }
            // alert(thisYear+' '+thisMonth+' '+thisDay);
            var temp = evt.target.result;
            var bloodData = JSON.parse( '['+temp.substr(1)+']' );
            var dataLength = bloodData.length;

            var i = dataLength-1;

            for (i; i >= 0 ; i--) 
            {
                if( bloodData[i].date.substr(0,4) == thisYear && bloodData[i].date.substr(5,2) == thisMonth && bloodData[i].date.substr(8,2) == thisDay)
                {
                    result = true;
                    break;   
                }
            }
            // 結果為真, X -> V
            if( result == true ){
                $('#home .bloodsugarList').css('background-color','#66FF33');
                $('#home .bloodsugarList').html('<i class="fa fa-check"></i>血糖'+
                    '<ul>'+'<li>血糖值: '+bloodData[i].value+'</li>'+
                    '<li>時間: '+bloodData[i].mealtype+'</li>'+'</ul>');
                $('#home .bloodsugarList').click(function(){
                    $(this).children('ul').slideToggle();
                })

            }
        }
        reader.readAsText(file);
    }
}


   