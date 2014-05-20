$(document).ready(function () {
        $('#alertHome .submit').click(function () {
        var switchInstance = $(".bsNoti").data("kendoMobileSwitch");
        console.log(switchInstance);
        if (switchInstance.check() === true) {
            addNoti();
        }
    });

});

function addNoti() {
    // alert("addNOti");
    var d = new Date();
    var now = new Date().getTime();
    var _10_seconds_from_now = new Date(now + 10 * 1000);
    d.setHours(12, 0, 0);

    window.plugin.notification.local.add({
        message: 'Time to roll out!',
        id: 1,
        autoCancel: true,
        date: _10_seconds_from_now
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
function alertDismissed() {
    // 開啟量血糖的畫面(需調整
    window.open("index.html");
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