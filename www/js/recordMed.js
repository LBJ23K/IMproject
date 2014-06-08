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
        alert('done');

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
        check();
    }
    
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
