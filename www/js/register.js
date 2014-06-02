var a = "aaaa";

function autoRegister() {
alert(device.uuid);
	$.post("http://140.112.106.105/gundam/autoRegister.php", 
    { 
        did: deviceID
    },
    
    function(data){
        alert(data);
    });
}

function checkRegisterStatus() {
	$.post("http://140.112.106.105/gundam/autoRegister.php", 
    { 
        did: deviceID
    },

    function(data){
        alert(data);
    });
}
