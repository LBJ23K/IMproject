
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

        reader.onloadend = function(evt) {
            var result = false; 
            var result2 = false;
            var result3 = false;
            var newDate = new Date().getFullYear()+ '-'+(new Date().getMonth()+1)+'-'+new Date().getDate();

            var temp = evt.target.result;
            var allData = JSON.parse(temp);
            var dataLength = allData.length;
            //alert(dataLength);
            var i = dataLength - 1;
            //alert('i='+i);
            //alert(allData[i].date);
            var j = allData[i].bloodsugar.length - 1;
            //alert('j='+j);
            if(allData[i].bloodsugar.length>0) result = true;

            // 結果為真, X -> V
            if( result == true ){
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
                $('#home .medicineList').css('background-color','#66FF33');
                $('#home .medicineList').html('<i class="fa fa-check"></i>藥物'+
                    '<ul>'+'<li>時間: '+allData[i].medicine[k].mealtype+'</li>'+
                    '<li>藥物: '+allData[i].medicine[k].medname+'</li>'+'</ul>');
                $('#home .medicineList').click(function(){
                    $(this).children('ul').slideToggle();
                })

            }
            
            var h = allData[i].diet.length - 1;
            //alert('h='+h);
            if(allData[i].diet.length>0) result3 = true;
            if( result3 == true ){
                $('#home .dietList').css('background-color','#66FF33');
                $('#home .dietList').html('<i class="fa fa-check"></i>飲食'+
                    '<ul>'+'<li>食物: '+allData[i].diet[h].foodType+'</li>'+'</ul>');
                $('#home .dietList').click(function(){
                    $(this).children('ul').slideToggle();
                })

            }
        }
        reader.readAsText(file);
    }
}
