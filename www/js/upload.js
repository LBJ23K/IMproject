var jsonString = '';
var serverMedImgPath = '';
var serverDietImgPath = '';

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

                // 傳送照片
                medImgUpload(myData[i].medicine[j].imgPath, myData[i].medicine[j].imgName);

                $.post("http://140.112.106.105/diabetic/uploadMed.php", 
                { 
                    date: myData[i].date,
                    name: myData[i].medicine[j].medname,
                    mealtype: myData[i].medicine[j].mealtype,

                    imgPath: serverMedImgPath,
                    imgName: myData[i].medicine[j].imgName,

                    comment: myData[i].medicine[j].comment,
                    id: userID
                },
                function(data){
                    //
                });
            }

            // 傳送bloodsugar 的資料
            for( var k = 0; k < bsNum; k++ )
            {
                $.post("http://140.112.106.105/diabetic/uploadBs.php", 
                { 
                    date: myData[i].date,
                    mealtype: myData[i].bloodsugar[k].mealtype,
                    value: myData[i].bloodsugar[k].value,
                    comment: myData[i].bloodsugar[k].comment,
                    id: userID
                },
                function(data){
                    //
                });
            }

            // 傳送diet 的資料
            for( var l = 0; l < dietNum; l++ )
            {
                // 傳送照片
                dietImgUpload(myData[i].diet[l].imgPath, myData[i].diet[l].imgName);

                $.post("http://140.112.106.105/diabetic/uploadDiet.php", 
                { 
                    date: myData[i].date,
                    foodtype: myData[i].diet[l].foodType,
                    imgPath: serverDietImgPath,
                    imgName: myData[i].diet[l].imgName,
                    comment: myData[i].diet[l].comment,
                    id: userID
                },
                function(data){
                    //
                });
            }
        }

        alert("上傳成功!");
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
        //assign the data to the global var
        jsonString = evt.target.result;
        //upload json data
        uploadJson();
    };
    reader.readAsText(file); 

}

function medImgUpload(imgURI, imgName) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imgName;
    options.mimeType = "image/jpeg";

    serverMedImgPath = "http://140.112.106.105/diabetic/img/" + options.fileName;

    var ft = new FileTransfer();
    ft.upload(imgURI, encodeURI("http://140.112.106.105/diabetic/medImg.php"), win, fail, options);
}

function dietImgUpload(imgURI, imgName) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imgName;
    options.mimeType = "image/jpeg";

    serverDietImgPath = "http://140.112.106.105/diabetic/img/" + options.fileName;

    var ft = new FileTransfer();
    ft.upload(imgURI, encodeURI("http://140.112.106.105/diabetic/dietImg.php"), win, fail, options);
}

function win(r) {
    //alert("Code = " + r.responseCode);
    //alert("Response = " + r.response);
    //alert("Sent = " + r.bytesSent);
}

function lose(error) {
    alert("An error has occurred: Code = " + error.code);
}

