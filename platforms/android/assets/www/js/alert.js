$(document).ready(function() {
    $("#alertTimepicker").kendoTimePicker({
        format: "HH:mm",
        //interval: 30  --> this is default
        value: "12:00"
    });
});

function alertSetup() {
    var switchInstance = $(".bsNoti").data("kendoMobileSwitch");
    var timepicker = $("#alertTimepicker").data("kendoTimePicker");
    var hour = timepicker.value().getHours();
    var minute = timepicker.value().getMinutes();

    if (switchInstance.check() === true) {
        addNoti(hour, minute);
    }
}

function addNoti(hour, minute) {
    var date = new Date();
    date.setHours(hour, minute, 0);

    window.plugin.notification.local.add({
        message:    'Time to roll out!',
        id:         1,
        autoCancel: true,
        repeat:     'daily',
        date:       date              
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
function alertDismissed() {
    // 開啟量血糖的畫面(需調整)
    window.open("index.html#bloodSugar");
}

// Show a custom alertDismissed
function showAlert() {
    // alert("show");
    navigator.notification.alert(
        '該量血糖囉!', // message
        alertDismissed, // callback
        'Diabetes', // title
        '馬上量!' // buttonName
    );
}