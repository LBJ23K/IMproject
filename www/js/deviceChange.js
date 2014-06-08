var token = function() {
    return Math.random().toString(36).substr(2); // remove '0.'
};

var jsonData = [];

var userToken = '';

function generateToken() {
	userToken = token(); // example "bnh5yzdirjinqaor", 16 characters

    $.post("http://140.112.106.105/gundam/generateToken.php", 
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
    $.post("http://140.112.106.105/gundam/getToken.php", 
    { 
        uid: userID
    },
    
    function(data){
        alert(data);
    });
}

function changeID() {
    userToken = $('#inputToken').val();

    $.post("http://140.112.106.105/gundam/checkToken.php", 
    { 
        token: userToken
    },
    
    function(data){
        userID = data;
        alert("userid = "+ userID);

    });
}

function syncData() {
alert("click");
    $.post("http://140.112.106.105/gundam/syncMed.php", 
    { 
        uid: userID
    },
    
    function(data){
        syncMed(JSON.parse(data));
    });

    $.post("http://140.112.106.105/gundam/syncBloodsugar.php", 
    { 
        uid: userID
    },
    
    function(data){
        syncBloodsugar(JSON.parse(data));
    });
}

function syncMed(serverData) {
alert("medsync");
alert(serverData[i]["med_name"]);
    //serverData的物件數
    var num = serverData.length;

    for( var i = 0; i < num; i++ )
    {
        var medName = serverData[i]["med_name"];
        var medTime = serverData[i]["med_mealtype"];
        var newDate2 = serverData[i]["med_date"];
        var medComment = serverData[i]["med_comment"];
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
alert("write med");

    writer.onwriteend = function () {

        $('.ok').fadeIn().delay(1500).fadeOut('slow');

        // 檢察今天是否有紀錄
        check();
    }
    //convert a value to JSON
    writer.write(JSON.stringify(jsonData));

}

function syncBloodsugar(serverData) {
alert("bssync");
    //serverData的物件數
    var num = serverData.length;

    for( var i = 0; i < num; i++ )
    {
        var bloodsugarData = {};
        var bloodsugarDataWithdate = {};
        var bloodsugar = serverData[i]["value"];
        var mealType = serverData[i]["bs_mealtype"];
        var comment = serverData[i]["bs_comment"];

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

            var newDate2 = serverData[i]["bs_date"];
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
            for(var i =jsonData.length-1;i >= 0;i--){
                if(jsonData[i].date == newDate2){
                    if( jsonData[i].hasOwnProperty("bloodsugar") ) jsonData[i].bloodsugar.push(bloodsugarData);
                    else{
                        jsonData[i].bloodsugar = [];
                        jsonData[i].bloodsugar.push(bloodsugarData);
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
alert("write bs");
    writer.onwriteend = function(evt) {
        $('.ok').fadeIn().delay(1500).fadeOut('slow');
        if( $('#chart .error').css('display') == 'block'){
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSforInit, fail);
            $('#chart .error').css('display','none');
        }
        else{
                
        }

        check();
    }

    writer.write( JSON.stringify(jsonData) );

}
