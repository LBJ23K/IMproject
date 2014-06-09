var newFoodName = '';
var foodNameArray = [];

// 新增藥物名稱
function newFood() {
    newFoodName = $('#userFood').val();

    $('#foodCheckbox').append(
        '<input type="checkbox" name="foodCheck[]" value="' + newFoodName + '" />' + newFoodName + '<br>'
    );

	saveFoodName();
}

// 將新增的藥物名稱儲存在檔案
function saveFoodName() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSfoodname, fail);
}

function gotFSfoodname(fileSystem) {
    fileSystem.root.getFile("foodName.txt", 
        {create: true, exclusive: false}, 
        gotFileEntryfoodname, fail);
}

function gotFileEntryfoodname(fileEntry) {
    fileEntry.createWriter(gotFileWriterfoodname, fail);
}

function gotFileWriterfoodname(writer) {
    if( writer.length === 0 )
    {
        writer.write(newFoodName);
    }
    else
    {
        // write newMedName
        writer.onwriteend = function(evt) {
            writer.seek(writer.length);
            writer.write(newFoodName);
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
function loadFoodName() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSfoodname2, fail);
}

function gotFSfoodname2(fileSystem) {
    fileSystem.root.getFile("foodName.txt", null, gotFileEntryfoodname2, fail);
}

function gotFileEntryfoodname2(fileEntry) {
    fileEntry.file(gotFilefoodname, fail);
}

function gotFilefoodname(file){
    readAsTextfoodname(file);
}

function readAsTextfoodname(file) {
    var reader = new FileReader();

    //asnycrhonous task has finished, fire the event:
    reader.onloadend = function(evt) {
        //assign the data to the global var
        foodNameArray = evt.target.result.split(',');
        //upload json data
        updateFoodCheckbox();
    };
    reader.readAsText(file); 

}

// 更新藥物名稱選項
function updateFoodCheckbox() {
    var i = 0;

    while ( typeof(foodNameArray[i]) !== "undefined" )
    {
        $('#foodCheckbox').append(
            '<input type="checkbox" name="foodCheck[]" value="' + foodNameArray[i] + '" />' + foodNameArray[i] + '<br>'
        );

        i = i + 1;
    }
}

