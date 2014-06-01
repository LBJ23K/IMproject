var imgURI = '';

$(document).ready(function () {
    $('#medRecord .submit').click(function () {

        var medName = $('#medRecord .medName :selected').text();
        var medTime = $('#medRecord td.active').text();
        var newDate = new Date();
        var newDate2 = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + (newDate.getDate()); 
        var medComment = $('#medRecord textarea').val();
        
        medData.medname = medName;
        medData.mealtype = medTime;
        medData.imgPath = imgURI;
        medData.comment = medComment;

        if (globeData.length == 0) {
            data.date = newDate2;
            data.medicine = [];
            data.medicine.push(medData);
            data.bloodsugar = [];
            data.diet = [];
            globeData.push(data);
        } else {
            var found = false;
            for (var i = globeData.length - 1; i >= 0; i--) {
                if (globeData[i].date == newDate2) {
                    if (globeData[i].hasOwnProperty("medicine")) globeData[i].medicine.push(medData);
                    else {
                        globeData[i].medicine = [];
                        globeData[i].medicine.push(medData);
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
                    globeData.push(data);
                }
            }

        }
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    })
});

function gotFS(fileSystem) {
    fileSystem.root.getFile("data.json", {
        create: true,
        exclusive: false
    }, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter2, fail);
}

function gotFileWriter2(writer) {

    writer.onwriteend = function () {

        $('.ok').fadeIn().delay(1500).fadeOut('slow');

        // 檢察今天是否有紀錄
        check();
    }
    //convert a value to JSON
    writer.write(JSON.stringify(globeData));

}

// 照相
function medPhoto() {
    navigator.camera.getPicture(onPhotoURISuccessmed, onFail, { 
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI
    });    
}

// Called when a photo is successfully retrieved
function onPhotoURISuccessmed(imageURI) {
    // Get image handle
    var displayImage = document.getElementById('medImage');

    // Show the captured photo
    displayImage.src = imageURI;
    imgURI = imageURI;          
}

// Called if something bad happens.
function onFail(message) {
    alert('Failed because: ' + message);
}
