function runSerialLoop(wnd) {
    console.log("Running serial port detection and listener loop");

    chrome.serial.getDevices(function(devices) {
        devices.forEach(function(device) {
            console.log("Connecting to: "+device.path);
            chrome.serial.connect(device.path, {}, function(conninfo){
                var line="";
                chrome.serial.onReceive.addListener(function(info) {
                    var d=String.fromCharCode.apply(null, new Uint8Array(info.data));
                    line+=d;
                    var i=line.indexOf('\n');
                    if ( i >= 0 ) {
                        // print the data from the arduino
                        var dataLineJson=line.substr(0, i);
                        console.log(dataLineJson);
                        try {
                            var data=JSON.parse(dataLineJson);
                            if ( data.error != 0 ) {
                                console.error("Error from Arduino");
                                console.error(data);
                            } else {
                                wnd.contentWindow.updateData(data);
                            }
                        } catch (e) {
                            console.error(e);
                        }
                        line=line.substr(i+1);
                    }
                });
            });
        });
    });
    console.log(wnd);
}

chrome.app.runtime.onLaunched.addListener(function() {
    console.log("Starting chrome app");
    var wnd=chrome.app.window.create('scene.html', {
        id: 'main',
        bounds: {
            width: 800,
            height: 600,
            left: 100,
            top: 100
        },
        minWidth: 800,
        minHeight: 600
    }, function(wnd) {
        wnd.contentWindow.addEventListener('load', function(e) {
            runSerialLoop(wnd);
        });
    });
});
