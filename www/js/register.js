function autoRegister() {
alert(device.uuid);
	$.post("http://140.112.106.105/gundam/autoRegister.php", 
    { 
        did: deviceID
    },
    
    function(data){
        alert(data);
        getID();
    });
}

function getID() {
    $.post("http://140.112.106.105/gundam/checkID.php", 
    { 
        did: deviceID
    },
    
    function(data){
        userID = data;
        alert("userid = " + userID);
    });
}
