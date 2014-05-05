var imgName = '';

$(document).ready(function(){
	$('#eatDrink .addnewItem').click(function(){
		$('#eatDrink .eatForm').append('<input type="checkbox"/><input class="newItem" type="text"/><br/>')
	})
	$('#recordHome .large_btn.drink').click(function(){
		capturePhoto();

	})
	$('#eatDrink .submit').click(function(){

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem){
			fileSystem.root.getFile("food.json", {create: true, exclusive: false}, function (fileEntry){
				fileEntry.createWriter(gotFileWriterForeatDrink, fail);
			}, fail);
		}, fail);
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

//file system fail 
function fsFail(error) { 
    alert("failed with error code: " + error.code); 
}

// // called if something bad happens
// function onFail(message) {
//     alert('Failed because: ' + message);
// }

// // write the user input string to the file


function gotFileWriterForeatDrink(writer) {
    writer.write(str);
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
