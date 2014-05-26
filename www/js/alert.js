$(document).ready(function(){
    $('#medRecord .submit').click(function(){

        var medName = $('#medRecord .medName :selected').text();
        var medTime = $('#medRecord td.active').text();
        var newDate = new Date();
        var month = new Date().getMonth()+1;
        var day = new Date().getDate();
        var newDate2 = newDate.getFullYear() + '-'+(newDate.getMonth()+1)+'-'+(newDate.getDate() );
        medData.medname = medName;
        medData.mealtype = medTime;

        if(globeData.length == 0 ){
            data.date = newDate2;
            data.medicine = [];
            data.medicine.push(medData);
            data.bloodsugar = [];
            data.diet = [];
            globeData.push( data );
        }
            else {
                var found = false;
                for(var i =globeData.length-1;i >= 0;i--){
                    if(globeData[i].date == newDate2){
                        if( globeData[i].hasOwnProperty("medicine") ) globeData[i].medicine.push(medData);
                        else{
                            globeData[i].medicine = [];
                            globeData[i].medicine.push(medData);
                        }
                        found  = true;
                        break;
                    }
                 if(!found){
                  data.date = newDate2;
                  data.medicine = [];
                  data.medicine.push(medData);
                  data.bloodsugar = [];
                  data.diet = [];
                  globeData.push( data );
                }    
              }
               
            }   
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail); 
            })
   $('#alertHome .submit').click(function(){
    // alert("yo");
         var switchInstance = $(".bsNoti").data("kendoMobileSwitch");
         console.log(switchInstance);
                if( switchInstance.check() === true )
                {
                    addNoti();
                }
   });

});



function gotFS(fileSystem) 
         {
            fileSystem.root.getFile("data.json", {create: true, exclusive: false}, gotFileEntry, fail);
         }

function gotFileEntry(fileEntry) 
{
   fileEntry.createWriter(gotFileWriter2, fail);
}
function gotFileWriter2(writer) 
{

    writer.onwriteend = function(){

      $('.ok').fadeIn().delay(1500).fadeOut('slow');
      // $('#home .medicineList').css('background-color','#66FF33');
      //  $('#home .medicineList').html('<i class="fa fa-check"></i>藥物'+
      //     '<ul>'+'<li>時間: '+allData[i].medicine[k].mealtype+'</li>'+
      //     '<li>藥物: '+allData[i].medicine[k].medname+'</li>'+'</ul>');
      // $('#home .medicineList').click(function(){
      //     $(this).children('ul').slideToggle();
      // })  
      check();
    }
    writer.write( JSON.stringify(globeData) );

}


function addNoti() 
{
   // alert("addNOti");
    var d = new Date();
    var now = new Date().getTime();
    var _10_seconds_from_now = new Date(now + 10*1000);
    d.setHours(12,0,0);

    window.plugin.notification.local.add({ 
        message: 'Time to roll out!',
        id:         1,
        autoCancel: true,
        date:        _10_seconds_from_now 
        //repeat:     'daily',
        //date:         d               
    });

    window.plugin.notification.local.ontrigger = function (id, state, json) {                
        navigator.notification.vibrate(2000);
        // Wait for device API libraries to load
        showAlert();
    }

    window.plugin.notification.local.onclick = function (id, state, json) {
        // Wait for device API libraries to load
        showAlert();
     }
}

// alert dialog dismissed
function alertDismissed() 
{
    // 開啟量血糖的畫面(需調整
    window.open("index.html");
}

// Show a custom alertDismissed
function showAlert() {
   // alert("show");
    navigator.notification.alert(
        '該量血糖囉!',    // message
        alertDismissed,   // callback
        'Diabetes',         // title
        '馬上量!'         // buttonName
    );
}