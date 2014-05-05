$(document).ready(function(){
   $('#medRecord .submit').click(function(){
         // alert(medTime);
         
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
            fileSystem.root.getFile("medicine.json", {create: true, exclusive: false}, gotFileEntry, fail);
         }

function gotFileEntry(fileEntry) 
{
   fileEntry.createWriter(gotFileWriter2, fail);
}
function gotFileWriter2(writer) 
{

  var medName = $('#medRecord .medName :selected').text();
   // var medTime = $('.medTime :selected').text();
   var medTime = $('#medRecord td.active').text();
   var year = new Date().getFullYear();
   var month = new Date().getMonth()+1;
   var day = new Date().getDate();
   console.log(medName);
 
   // first time --> [{json data}]
   if( writer.length === 0 )
   {
      writer.onwriteend = function(){
        $('.fa.fa-times:eq(1)').attr('class','fa fa-check');
                $('#home .medicineList').css('background-color','#66FF33');
                $('#home .medicineList').html(
                    '<ul>'+'<li>時間:'+medTime+'</li>'+
                    '<li>藥物'+medName+'</li>'+'</ul>');
                $('#home .medicineList').click(function(){
                    $(this).children('ul').slideToggle();
                        // alert('w');
                })  
      }
      var data = [{"name":medName,"year":year,"month":month,"day":day,"time":medTime}];
      writer.write(data);
   }

   // second time and then --> [{json data}]
   else
   {
      var data = {"name":medName,"year":year,"month":month,"day":day,"time":medTime};
      alert(data.name);
      // write json data
      writer.onwriteend = function(evt) {
         writer.seek(writer.length);
         writer.write(data);
         // write "]"
         writer.onwriteend = function(evt) {
            writer.seek(writer.length);
            writer.write("]");
            // log "write successfully"
            writer.onwriteend = function(evt){
               $('.fa.fa-times:eq(1)').attr('class','fa fa-check');
                $('#home .medicineList').css('background-color','#66FF33');
                $('#home .medicineList').html('<i class="fa fa-check"></i>藥物'+
                    '<ul>'+'<li>時間:'+medTime+'</li>'+
                    '<li>藥物'+medName+'</li>'+'</ul>');
                $('#home .medicineList').click(function(){
                    $(this).children('ul').slideToggle();
                        // alert('w');
                }) 
            }
         };
      };

      // replace "]" with ","
      writer.seek((writer.length - 1));
      writer.write(",");

   }
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
        'Gundam',         // title
        '馬上量!'         // buttonName
    );
}