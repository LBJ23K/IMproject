var dietData = {};
var dietImgURI = '';

$(document).ready(function(){
	$('#eatDrink .eatImage').click(function(){
		capturePhoto();
	});

    $('#eatDrink td').click(function(){
        $('#eatDrink td').each(function(){
            $(this).removeClass('active');
        });
        $(this).addClass('active');
    });

	$('#eatDrink .submit').click(function(){
		var foodString = "";

        var dietTime = $('#eatDrink td.active').text();

        $('input[name="foodCheck[]"]').each(function () {
            if (this.checked)
            {
                if (foodString === '')
                {
                    foodString = $(this).val();
                }
                else
                {
                    foodString = foodString + ',' + $(this).val();
                }
            }
        });

		var newDate = new Date();
        var newDate2 = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + (newDate.getDate()); 
		var foodComment = $('#eatDrink textarea').val();
		
		dietData.foodType = foodString;
		dietData.imgPath = dietImgURI;
		dietData.comment = foodComment;
        dietData.mealtype = dietTime;
		if(globeData.length == 0) {
			data.date = newDate2;
			data.diet = [];
			data.diet.push(dietData);
			data.medicine = [];
			data.bloodsugar = [];
			globeData.push(data);
		} else {
			var found = false;
			for (var i = globeData.length - 1; i >= 0; i--) {
                if (globeData[i].date == newDate2) {
                    if (globeData[i].hasOwnProperty("diet")) globeData[i].diet.push(dietData);
                    else {
                        globeData[i].diet = [];
                        globeData[i].diet.push(dietData);
                    }
                    found = true;
                    break;
                }
                if (!found) {
                    data.date = newDate2;
                    data.diet = [];
                    data.diet.push(dietData);
                    data.bloodsugar = [];
                    data.medicine = [];
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

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS_diet, fail);
    });
});

function capturePhoto() {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoSuccess, function(message) {
		alert('Image Capture Failed');
	}, {
		quality : 40,
		destinationType : navigator.camera.DestinationType.FILE_URI,
        correctOrientation:1
	});
}

function onPhotoSuccess(imageURI) {
	$('#eatDrink .eatImage .des').hide();

    $('#eatDrink .eatImage img').attr('src',imageURI);
	// resolve file system for image  
    window.resolveLocalFileSystemURI(imageURI, function (fileEntry){
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem){
    		var foodImageName = randomString(5);
            foodImageName = foodImageName + '.jpg';
    		fileEntry.moveTo(fileSystem.root, foodImageName, getDietURI, fsFail); 
    		//app.navigate('#eatDrink');
    	}, fsFail);
    }, fsFail); 
}

function getDietURI(fileEntry) {
    // retrieve uri
    dietImgURI = fileEntry.toURL();
}

function gotFS_diet(fileSystem) {
    fileSystem.root.getFile("data.json", {
        create: true,
        exclusive: false
    }, gotFileEntry_diet, fail);
}

function gotFileEntry_diet(fileEntry) {
    fileEntry.createWriter(gotFileWriter_diet, fail);
}

function gotFileWriter_diet(writer) {

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
        setTimeout($.unblockUI, 1500);
        check();
        onChange2();
    }

    //convert a value to JSON
    writer.write(JSON.stringify(globeData));

}

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function onFail(message) {
    alert('Failed because: ' + message);
}
