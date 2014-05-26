var jsonString = '';
var uuid = window.device.uuid;

function uploadJson() {
    var myData = JSON.parse(jsonString);
    if (myData != '' || myData != undefined) {
        //myData的物件數
        var num = myData.length;
  
        for( var i = 0; i < num; i++ )
        {
            // medicine, bloodsugar 和diet 的物件數
            var medNum = myData[i].medicine.length;
            var bsNum = myData[i].bloodsugar.length;
            var dietNum = myData[i].diet.length;

            // 傳送medicine 的資料
            for( var j = 0; j < medNum; j++ )
            {
                $.post("http://140.112.106.105/gundam/uploadMed.php", 
                { 
                    date: myData[i].date,
                    mealtype: myData[i].medicine[j].mealtype,
                    name: myData[i].medicine[j].name,
                    id: uuid
                },
                function(data){
                    alert(data);
                });
            }

            // 傳送bloodsugar 的資料
            for( var k = 0; k < bsNum; k++ )
            {
                $.post("http://140.112.106.105/gundam/uploadBs.php", 
                { 
                    date: myData[i].date,
                    mealtype: myData[i].bloodsugar[k].mealtype,
                    value: myData[i].bloodsugar[k].value,
                    comment: myData[i].bloodsugar[k].comment,
                    id: uuid
                },
                function(data){
                    alert(data);
                });
            }

            // 傳送diet 的資料
            for( var l = 0; l < dietNum; l++ )
            {
                $.post("http://140.112.106.105/gundam/uploadDiet.php", 
                { 
                    date: myData[i].date,
                    mealtype: myData[i].diet[l].type,
                    img: myData[i].diet[l].photo,
                    comment: myData[i].diet[l].comment,
                    id: uuid
                },
                function(data){
                    alert(data);
                });
            }
        }
    } 
    else {
        alert("myData fail!");
    }
}

// device APIs are available
function readJson() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSjson, fail);
}

function gotFSjson(fileSystem) {
    fileSystem.root.getFile("data.json", null, gotFileEntryjson, fail);
}

function gotFileEntryjson(fileEntry) {
    fileEntry.file(gotFilejson, fail);
}

function gotFilejson(file){
    readAsTextjson(file);
}

function readAsTextjson(file) {
    var reader = new FileReader();

    //asnycrhonous task has finished, fire the event:
    reader.onloadend = function(evt) {
        alert("Read as text");
        //assign the data to the global var
        jsonString = evt.target.result;
        //upload json data
        uploadJson();
    };
    reader.readAsText(file); 

}
