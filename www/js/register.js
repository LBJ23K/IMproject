function autoRegister() {
	$.post("http://140.112.106.105/diabetic/autoRegister.php", 
    { 
        did: deviceID
    },
    
    function(data){
        getID();
    });
}

function getID() {
    $.post("http://140.112.106.105/diabetic/checkID.php", 
    { 
        did: deviceID
    },
    
    function(data){
        userID = data;
    });
}
