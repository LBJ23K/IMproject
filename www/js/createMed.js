var newName = '';
var nameArray = '';

function newMed() {
    newName = $('#userMed').val();

    var mySelect = document.getElementById("medSelect");
	var option = document.createElement("option");
	option.text = newName;
	mySelect.add( option );

	saveName();
}

function saveName() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSname, fail);
}

function gotFSname(fileSystem) {
    fileSystem.root.getFile("medName.txt", 
                            {create: true, exclusive: false}, 
                            gotFileEntryname, fail);
}

function gotFileEntryname(fileEntry) {
    fileEntry.createWriter(gotFileWritername, fail);
}

function gotFileWritername(writer) {
    if( writer.length === 0 )
    {
    	writer.write(newName);
    }
    else
    {
    	// write newName
        writer.onwriteend = function(evt) {
            writer.seek(writer.length);
            writer.write(newName);
                writer.onwriteend = function(evt){
                    console.log("write successfully");
                }
        };

    	// write ","
        writer.seek(writer.length);
        writer.write(',');
    }
}

function loadMedName() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSname2, fail);
}

function gotFSname2(fileSystem) {
    fileSystem.root.getFile("medName.txt", null, gotFileEntryname2, fail);
}

function gotFileEntryname2(fileEntry) {
    fileEntry.file(gotFilename, fail);
}

function gotFilename(file){
    readAsTextname(file);
}

function readAsTextname(file) {
    var reader = new FileReader();

    //asnycrhonous task has finished, fire the event:
    reader.onloadend = function(evt) {
        alert("Read as text");
        //assign the data to the global var
        nameArray = evt.target.result.split(',');
        //upload json data
        updateSelect();
    };
    reader.readAsText(file); 

}

function updateSelect() {
    var i = 0;

    while ( typeof(nameArray[i]) !== "undefined" )
    {
        alert(nameArray[i]);

        var mySelect = document.getElementById("medSelect");
        var option = document.createElement("option");
        option.text = nameArray[i];
        mySelect.add( option );

        i = i + 1;
    }
}
