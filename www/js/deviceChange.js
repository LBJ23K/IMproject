var token = function() {
    return Math.random().toString(36).substr(2); // remove '0.'
};

var jsonData = [];

var userToken = '';

function generateToken() {
	userToken = token(); // example "bnh5yzdirjinqaor", 16 characters

    $.post("http://140.112.106.105/diabetic/generateToken.php", 
    { 
        uid: userID,
        token: userToken
    },
    
    function(data){
        alert(data);
        displayDeviceToken();
    });
}

function displayDeviceToken() {
    $.post("http://140.112.106.105/diabetic/getToken.php", 
    { 
        uid: userID
    },
    
    function(data){
        document.getElementById('myToken').innerHTML = "我的驗證碼: " + data;
    });
}

function checkToken() {
    userToken = $('#inputToken').val();

    $.post("http://140.112.106.105/diabetic/checkToken.php", 
    { 
        token: userToken
    },
    
    function(data){
        userID = data;
        changeID(userID);
    });
}

function changeID(id) {
    $.post("http://140.112.106.105/diabetic/changeID.php", 
    { 
        uid: userID,
        did: deviceID
    },
    
    function(data){
        alert(data);
    });
}

function syncData() {
    $.post("http://140.112.106.105/diabetic/syncMed.php", 
    { 
        uid: userID
    },
    
    function(data){
        syncMed(JSON.parse(data));
    });

    $.post("http://140.112.106.105/diabetic/syncBloodsugar.php", 
    { 
        uid: userID
    },
    
    function(data){
        syncBloodsugar(JSON.parse(data));
    });
    alert("同步完成!");
}

function syncMed(serverData) {
    //serverData的物件數
    var num = serverData.length;

    for( var m = 0; m < num; m++ )
    {
        var medName = serverData[m]["med_name"];
        var medTime = serverData[m]["med_mealtype"];
        var newDate2 = serverData[m]["med_date"];
        var medComment = serverData[m]["med_comment"];
        var imgURI = 'test';
        
        medData.medname = medName;
        medData.mealtype = medTime;
        medData.imgPath = imgURI;
        medData.comment = medComment;

        if (jsonData.length == 0) {
            data.date = newDate2;
            data.medicine = [];
            data.medicine.push(medData);
            data.bloodsugar = [];
            data.diet = [];
            jsonData.push(data);
        } else {
            var found = false;
            for (var i = jsonData.length - 1; i >= 0; i--) {
                if (jsonData[i].date == newDate2) {
                    if (jsonData[i].hasOwnProperty("medicine")) jsonData[i].medicine.push(medData);
                    else {
                        jsonData[i].medicine = [];
                        jsonData[i].medicine.push(medData);
                    }
                    found = true;
                    break;
                }
                if (!found) {
                    data.date = newDate2;
                    data.medicine = [];
                    data.medicine.push(medData);
                    data.bloodsugar = [];
                    data.diet = [];
                    jsonData.push(data);
                }
            }

        }
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSmedsync, fail);
    }
}

function gotFSmedsync(fileSystem) {
    fileSystem.root.getFile("data.json", {
        create: true,
        exclusive: false
    }, gotFileEntrymedsync, fail);
}

function gotFileEntrymedsync(fileEntry) {
    fileEntry.createWriter(gotFileWritermedsync, fail);
}

function gotFileWritermedsync(writer) {

    writer.onwriteend = function () {

        $('.ok').fadeIn().delay(1500).fadeOut('slow');

        // 檢察今天是否有紀錄
        check();
    }
    //convert a value to JSON
    writer.write(JSON.stringify(jsonData));
}

function syncBloodsugar(serverData) {
    //serverData的物件數
    var num = serverData.length;

    for( var n = 0; n < num; n++ )
    {
        var bloodsugarData = {};
        var bloodsugarDataWithdate = {};
        var bloodsugar = serverData[n]["value"];
        var mealType = serverData[n]["bs_mealtype"];
        var comment = serverData[n]["bs_comment"];

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

            var newDate2 = serverData[n]["bs_date"];
            bloodsugarDataWithdate.date = newDate2;

            if(jsonData.length == 0 ){
                data.date = newDate2;
                data.medicine = [];
                data.bloodsugar = [];
                data.bloodsugar.push( bloodsugarData );
                data.diet = [];
                jsonData.push( data );
            }
        else {
            var found = false;
            for(var j =jsonData.length-1;j >= 0;j--){
                if(jsonData[j].date == newDate2){
                    if( jsonData[j].hasOwnProperty("bloodsugar") ) jsonData[j].bloodsugar.push(bloodsugarData);
                    else{
                        jsonData[j].bloodsugar = [];
                        jsonData[j].bloodsugar.push(bloodsugarData);
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
                jsonData.push( data );
            }    
                
            }
           
        }
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSbssync, fail );
    }
}

function gotFSbssync(fileSystem) {
    fileSystem.root.getFile("data.json", {create: true, exclusive: false}, gotFileEntrybssync, fail);
}

function gotFileEntrybssync(fileEntry) {
    fileEntry.createWriter(gotFileWriterbssync, fail);
}

function gotFileWriterbssync(writer) {
    writer.onwriteend = function(evt) {
        $('.ok').fadeIn().delay(1500).fadeOut('slow');
        if( $('#chart .error').css('display') == 'block'){
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSforInit, fail);
            $('#chart .error').css('display','none');
        }
        else{
            //
        }

        check();
    }

    writer.write( JSON.stringify(jsonData) );
}
