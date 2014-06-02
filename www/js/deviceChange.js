var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};

var userToken = '';

function generateToken() {
	userToken = token(); // example "bnh5yzdirjinqaorq0ox1tf383nb3xr"
	var userID = '';

	alert("deviceid = " + deviceID);
	alert("userToken = " + userToken);

	$.post("http://140.112.106.105/gundam/checkID.php", 
    { 
        did: deviceID
    },
    
    function(data){
        userID = data;
    });

    alert("userid = "+ userID);
    alert("a = " + a);

	/*$.post("http://140.112.106.105/gundam/generateToken.php", 
    { 
        uid: userID,
        token: userToken
    },
    
    function(data){
        alert(data);
    });*/
}

function displayDeviceToken() {
	$.post("http://140.112.106.105/gundam/checkToken.php", 
    { 
        did: deviceID
    },
    
    function(data){
        userID = data;
    });
}

function getDeviceToken() {
	


}