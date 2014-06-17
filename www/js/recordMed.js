var medData = {};
var medImgURI = '';
var medimgName_global = '';
$(document).ready(function () {
    $('#medRecord .submit').click(function () {

        var medName = $('#medRecord #medSelect :selected').text();
        console.log(medName);
        var medTime = $('#medRecord td.active').text();
        var newDate = new Date();
        var newDate2 = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + (newDate.getDate()); 
        var medComment = $('#medRecord textarea').val();
        
        medData.medname = medName;
        medData.mealtype = medTime;
        medData.imgPath = medImgURI;
        medData.imgName = medimgName_global;
        medData.comment = medComment;
        // $('#medRecord .test2').attr('src',medImgURI);
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

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    })

    $('#medRecord td').click(function(){
        $('#medRecord td').each(function(){
            $(this).removeClass('active');
        });
        $(this).addClass('active');
    });

    $('#medRecord .medImage').click(function(){
        capturePhotoForMed();
    })

    $('#medRecord .reset').click(function(){
        $('#medRecord td').each(function(){
                $(this).removeClass('active');
        });
        $('#medRecord .medImage img').attr('src','');
        $('#medRecord .medImage .des').show();
        
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
        // 檢查是否有記錄
        setTimeout($.unblockUI, 1500);
        check();
        onChange2();
    }

    writer.write(JSON.stringify(globeData));

}

// 照相
function capturePhotoForMed(){
    navigator.camera.getPicture(onPhotoSuccessMed, function(message) {
        alert('照相失敗!');
    }, {
        quality : 40,
        destinationType : navigator.camera.DestinationType.FILE_URI,
        correctOrientation:1
    });
}

function onPhotoSuccessMed(imageURI) {
    $('#medRecord .medImage .des').hide();
    // alert(imageURI);
    $('#medRecord .medImage img').attr('src',imageURI);
    // resolve file system for image  
    window.resolveLocalFileSystemURI(imageURI, function (fileEntry){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem){
            var medImgName = randomString(5);
            medImgName = medImgName + '.jpg';
            medimgName_global = medImgName;
            fileEntry.moveTo(fileSystem.root, medImgName, getMedURI, fsFail);
        }, fsFail);
    }, fsFail);
}

function getMedURI(fileEntry) {
    // retrieve uri
    medImgURI = fileEntry.toURL();
}

function fsFail(error) { 
    alert("failed with error code: " + error.code); 
}

// Called if something bad happens.
function onFail(message) {
    alert('Failed because: ' + message);
}
