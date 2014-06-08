var imgName = '';

$(document).ready(function(){
	$('#eatDrink .addnewItem').click(function(){
		$('#eatDrink .eatForm').append('<input type="checkbox"/><input class="newItem" type="text"/><br/>')
	})
	$('#recordHome .large_btn.drink').click(function(){
		capturePhoto();
	})
	$('#eatDrink .submit').click(function(){
		var string = "";
		if(eatForm.check1.checked) string += "¤­¹ª®Ú²ô,"
		if(earForm.check2.chccked) string += "³J¨§³½¦×,"
		if(earForm.check3.chccked) string += "½­µæ,"
		if(earForm.check4.chccked) string += "¤ôªG,"
		if(earForm.check5.chccked) string += "¥¤Ãþ,"
		if(earForm.check6.chccked) string += "ªo¯×Ãþ,"
		string = string.slice(0, -1); //remove last ','
		
		var newDate = new Date();
        var newDate2 = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + (newDate.getDate()); 
		var foodComment = $('eatDrink textarea').val();
		
		foodData.string = string;
		foodData.imgPath = imgName;
		foodData.comment = foodComment;
		
		if(globeData.length == 0) {
			data.date = newDate2;
			data.diet = [];
			data.diet.push(foodData);
			data.medicine = [];
			data.bloodsugar = [];
			globeData.push(data);
		} else {
			var found = false;
			for (var i = globeData.length - 1; i >= 0; i--) {
                if (globeData[i].date == newDate2) {
                    if (globeData[i].hasOwnProperty("diet")) globeData[i].diet.push(foodData);
                    else {
                        globeData[i].diet = [];
                        globeData[i].diet.push(foodData);
                    }
                    found = true;
                    break;
                }
                if (!found) {
                    data.date = newDate2;
                    data.diet = [];
                    data.diet.push(foodData);
                    data.bloodsugar = [];
                    data.medicine = [];
                    globeData.push(data);
                }
            }

        }
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS_diet, fail);
    })
});

function capturePhoto() {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoSuccess, function(message) {
		alert('Image Capture Failed');
	}, {
		quality : 40,
		destinationType : navigator.camera.DestinationType.FILE_URI
	});
}

function onPhotoSuccess(imageURI) {
	$('#eatDrink .imageShow').show();

    $('#eatDrink .imageShow').attr('src',imageURI);
	    // resolve file system for image  
    window.resolveLocalFileSystemURI(imageURI, function (fileEntry){
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem){
    		imageName = randomString(5);
    		fileEntry.moveTo(fileSystem.root, imageName+'.jpg', null, null); 
    		app.navigate('#eatDrink');
    	}, fsFail);
    }, fsFail); 
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

        $('.ok').fadeIn().delay(1500).fadeOut('slow');

        // ÀË¹î¤µ¤Ñ¬O§_¦³¬ö¿ý
        check();
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
