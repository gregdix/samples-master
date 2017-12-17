//conn_main
function onDeviceReady() {
	navigator.splashscreen.hide();
	var macInfo = new MacApp();
	macInfo.run();
    //
    
    
}
function testSc(){
    // alert("Test");
    getMacX();
}

function MacApp(){
    
} 

var MacAddress = {

 	getMacAddress: function(successCallback, failureCallback){
 		cordova.exec(successCallback, failureCallback, 'MacAddressPlugin',
 			'getMacAddress', []);
 	}
 };

 module.exports = MacAddress;
    //

      

//end connmain



//MacAddress.js

/*
 * MacAddress
 * Implements the javascript access to the cordova plugin for retrieving the device mac address. Returns 0 if not running on Android
 * @author Olivier Brand
 */

/**
 * @return the mac address class instance
 */


//END


function getMacX() {
    window.MacAddress.getMacAddress(
        function (macAddress) {
            alert(macAddress);
            messageMacAddress.textContent = macAddress.toString().toUpperCase();
        }, function (fail) {
            alert(fail);

        }
    );
}
