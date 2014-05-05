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
                $('#home .medicineList').css('background-color','#66FF33');
                $('#home .medicineList').html('<i class="fa fa-check"></i>藥物'+
                    '<ul>'+'<li>時間:'+medData[i].time+'</li>'+
                    '<li>藥物'+medData[i].name+'</li>'+'</ul>');
                $('#home .medicineList').click(function(){
                    $(this).children('ul').slideToggle();
                })

            }
        }
        reader.readAsText(file);
    }

    function medFail(error) {
        alert('medFail');
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

        var result = false; 
        var reader = new FileReader();
        // 今天的年月日
        var thisYear = new Date().getFullYear();
        var thisMonth = new Date().getMonth() + 1; // 0 ~ 11
        var thisDay = new Date().getDate();

        reader.onloadend = function(evt) {
            var temp = evt.target.result;
            // alert(temp);
            var bloodData = JSON.parse( '['+temp.substr(1)+']' );

            // alert(bloodData);
            var dataLength = bloodData.length;
            // check
            var i = dataLength-1;
            // alert(i);

            alert(bloodData[0].date.getFullYear());
            for (; i >= 0 ; i--) 
            {
                if( bloodData[i].date.getFullYear() === thisYear && bloodData[i].date.getMonth() === thisMonth && bloodData[i].date.getDate() === thisDay)
                {
                    alert('true');
                    result = true;
                    break;   
                }
            }
            // 結果為真, X -> V
            if( result === true ){
                // $('.fa.fa-times:eq(0)').attr('class','fa fa-check');
                $('#home .bloodsugarList').css('background-color','#66FF33');
                $('#home .bloodsugarList').html('<i class="fa fa-check"></i>血糖'+
                    '<ul>'+'<li>血糖值:'+bloodData[i].value+'</li>'+
                    '<li>時間'+bloodData[i].mealtype+'</li>'+'</ul>');
                $('#home .bloodsugarList').click(function(){
                    $(this).children('ul').slideToggle();
                })

            }
        }
        reader.readAsText(file);
    }
}


   