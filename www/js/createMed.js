var newMedName = '';
var medNameArray = [];

// 新增藥物名稱
function newMed() {
    newMedName = $('#userMed').val();

    var mySelect = document.getElementById("medSelect");
	var option = document.createElement("option");
	option.text = newMedName;
	mySelect.add( option );

	saveMedName();
    closeModalViewMed();
}

// 將新增的藥物名稱儲存在檔案
function saveMedName() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSmedname, fail);
}

function gotFSmedname(fileSystem) {
    fileSystem.root.getFile("medName.txt", 
        {create: true, exclusive: false}, 
        gotFileEntrymedname, fail);
}

function gotFileEntrymedname(fileEntry) {
    fileEntry.createWriter(gotFileWritermedname, fail);
}

function gotFileWritermedname(writer) {
    if( writer.length === 0 )
    {
    	writer.write(newMedName);
    }
    else
    {
    	// write newMedName
        writer.onwriteend = function(evt) {
            writer.seek(writer.length);
            writer.write(newMedName);
                writer.onwriteend = function(evt){
                    console.log("write successfully");
                }
        };

    	// write ","
        writer.seek(writer.length);
        writer.write(',');
    }
}

// 載入藥物名稱檔案
function loadMedName() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSmedname2, fail);
}

function gotFSmedname2(fileSystem) {
    fileSystem.root.getFile("medName.txt", null, gotFileEntrymedname2, fail);
}

function gotFileEntrymedname2(fileEntry) {
    fileEntry.file(gotFilemedname, fail);
}

function gotFilemedname(file){
    readAsTextmedname(file);
}

function readAsTextmedname(file) {
    var reader = new FileReader();

    //asnycrhonous task has finished, fire the event:
    reader.onloadend = function(evt) {
        //assign the data to the global var
        medNameArray = evt.target.result.split(',');
        //upload json data
        updateMedSelect();
    };
    reader.readAsText(file); 

}

// 更新藥物名稱選項
function updateMedSelect() {
    var i = 0;

    while ( typeof(medNameArray[i]) !== "undefined" )
    {
        var mySelect = document.getElementById("medSelect");
        var option = document.createElement("option");
        option.text = medNameArray[i];
        mySelect.add( option );

        i = i + 1;
    }
}

function closeModalViewMed() {
    $("#createMed").kendoMobileModalView("close");
}
