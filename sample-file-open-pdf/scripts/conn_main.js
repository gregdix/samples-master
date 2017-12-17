document.addEventListener("deviceready", onDeviceReady, false);
//Activate :active state on devices
document.addEventListener("touchstart", function() {
}, false);

function onDeviceReady() {
	navigator.splashscreen.hide();
	var connectionInfo = new ConnectionApp();
	connectionInfo.run();
}

function ConnectionApp() {
}
 
ConnectionApp.prototype = {
	run: function() {
		var that = this,
			buttonCheckConnection = document.getElementById("buttonCheckConnection");
		
		buttonCheckConnection.addEventListener("click",
											   function() {
												   that._checkConnection.apply(that, arguments)
											   },
											   false);
		that._checkConnection();
	},
	
	_checkConnection: function() {
		var networkState = navigator.connection.type,
			messageConnectionType = document.getElementById("messageConnectionType"),
			currentTimeDiv = document.getElementById("currentTime");
        
		messageConnectionType.textContent = networkState.toString().toUpperCase();
		var now = new Date().toLocaleTimeString().split(" ")[0];
		
		currentTimeDiv.textContent = now;
	}
}

