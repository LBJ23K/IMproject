// 此函式檢查今天是否有吃藥
function check() {

    // 檢查結果(boolean), initialize to false
      

    // device APIs are available
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, dataGotFS, medFail);

    
    function medFail(error) {
        console.log(error.code);
    }    

    function dataGotFS(fileSystem) {
        fileSystem.root.getFile("data.json", null, dataGotFileEntry, medFail);
    }

    function dataGotFileEntry(fileEntry) {
        fileEntry.file(dataGotFile, medFail);
    }
    function dataGotFile(file) {
        checkData(file);
    }
    function checkData(file){
        var reader = new FileReader();
        // alert('checkData');
        reader.onloadend = function(evt) {
            // alert('read');
            var result = false; 
            var result2 = false;
            var newDate = new Date().getFullYear()+ '-'+(new Date().getMonth()+1)+'-'+new Date().getDate();

            var temp = evt.target.result;
            // alert(temp);
            var allData = JSON.parse(temp);
            // alert (allData);
            var dataLength = allData.length;

            var i = dataLength-1;
            // alert(dataLength);
            for (i; i >= 0 ; i--) 
            {
                if( allData[i].date == newDate)
                {
                    // result = true;
                    break;   
                }
            }
            //alert('i='+i);
            var j = allData[i].bloodsugar.length - 1;
            //alert('j='+j);
            if(allData[i].bloodsugar.length>0) result = true;

            // 結果為真, X -> V
            if( result == true ){
                // alert('result1');

                $('#home .bloodsugarList').css('background-color','#66FF33');
                $('#home .bloodsugarList').html('<i class="fa fa-check"></i>血糖'+
                    '<ul>'+'<li>血糖值: '+allData[i].bloodsugar[j].value+'</li>'+
                    '<li>時間: '+allData[i].bloodsugar[j].mealtype+'</li>'+'</ul>');
                $('#home .bloodsugarList').click(function(){
                    $(this).children('ul').slideToggle();
                })

            }
            var k = allData[i].medicine.length - 1;
            //alert('k='+k);
            if(allData[i].medicine.length>0) result2 = true;
            if( result2 == true ){
                // alert('result2');

                $('#home .medicineList').css('background-color','#66FF33');
                $('#home .medicineList').html('<i class="fa fa-check"></i>藥物'+
                    '<ul>'+'<li>時間: '+allData[i].medicine[k].mealtype+'</li>'+
                    '<li>藥物: '+allData[i].medicine[k].medname+'</li>'+'</ul>');
                $('#home .medicineList').click(function(){
                    $(this).children('ul').slideToggle();
                })

            }
        }
        reader.readAsText(file);
    }
}
   