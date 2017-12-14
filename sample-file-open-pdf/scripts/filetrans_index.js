document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var that = this,
		App = new downloadApp(),
		fileName = "sample.png",
		uri = encodeURI("http://www.telerik.com/sfimages/default-source/logos/app_builder.png"),
		folderName = "test";
    
	navigator.splashscreen.hide();
	App.run(uri, fileName, folderName);
}

//document.getElementById("Getlocal").addEventListener("click", function() {
  //  var checkLocal = localStorage.getItem("capturePath");
   // document.getElementById("localPath").value = checkLocal;
    
   // });

var downloadApp = function() {
}

downloadApp.prototype = {

    rst: null,

    run: function (uri, fileName, folderName) {
        rst = document.getElementById("result");
		var that = this,
			filePath = "";
        
		document.getElementById("download").addEventListener("click", function() {
			that.getFilesystem(
				function(fileSystem) {
					console.log("gotFS");
                    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
							filePath = folder.toURL() + "\/" + fileName;
							that.transferFile(uri, filePath)
						}, function() {
							console.log("failed to get folder");
						});
					} else {
						var filePath;
						var urlPath = fileSystem.root.toURL();
						if (device.platform == "Win32NT") {
							urlPath = fileSystem.root.fullPath;
						}
						if (parseFloat(device.cordova) <= 3.2) {
							filePath = urlPath.substring(urlPath.indexOf("/var")) + "\/" + fileName;
						} else {
							filePath = urlPath + "\/" + fileName;
						}
						that.transferFile(uri, filePath)
					}
				},
				function() {
					console.log("failed to get filesystem");
				}
				);
		});
		
		document.getElementById("upload").addEventListener("click", that.uploadFile);
	},
    
	getFilesystem:function (success, fail) {
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
	},

	getFolder: function (fileSystem, folderName, success, fail) {
		fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
	},

	transferFile: function (uri, filePath) {
		var transfer = new FileTransfer();
		transfer.download(
			uri,
			filePath,
			function(entry) {
				var targetPath = entry.toURL();
				if (device.platform == "Win32NT") {
					targetPath = entry.fullPath;
				}
				var image = document.getElementById("downloadedImage");
                image.src = targetPath;
				image.style.display = "block";
				image.display = targetPath;
				rst.innerHTML = "File saved to: " + targetPath;
                
                var image2 = document.getElementById("downloadedImage2");
                
                var targetPathLocal = localStorage.getItem("capturePath");
                image2.src = targetPathLocal;
				image2.style.display = "block";
				image2.display = targetPathLocal;
				//rst.innerHTML = "Media was saved to: " + targetPathLocal;
                
			},
			function(error) {
			    rst.innerHTML = "An error has occurred: Code = " + error.code;
				console.log("download error source " + error.source);
				console.log("download error target " + error.target);
				console.log("upload error code" + error.code);
			}
			);
	},
	
	uploadFile: function () {
	    rst.innerHTML = "";
		navigator.camera.getPicture(
			uploadPhoto,
			function(message) {
			    rst.innerHTML = "Failed to get a picture. Please select one.";
			}, {
				quality         : 50,
				destinationType : navigator.camera.DestinationType.FILE_URI,
				sourceType      : navigator.camera.PictureSourceType.PHOTOLIBRARY
			});
		
		function uploadPhoto(fileURI) {
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
			
			if (cordova.platformId == "android") {
				options.fileName += ".jpg" 
			}
			
			options.mimeType = "image/jpeg";
			options.params = {}; // if we need to send parameters to the server request 
			options.headers = {
				Connection: "Close"
			};
			options.chunkedMode = false;

			var ft = new FileTransfer();

			rst.innerHTML = "Upload in progress...";
			ft.upload(
				fileURI,
				encodeURI("http://www.filedropper.com"),
				onFileUploadSuccess,
				onFileTransferFail,
				options);
		
			function onFileUploadSuccess (result) {
				console.log("FileTransfer.upload");
				console.log("Code = " + result.responseCode);
				console.log("Response = " + result.response);
				console.log("Sent = " + result.bytesSent);
				console.log("Link to uploaded file: http://www.filedropper.com" + result.response);
				var response = result.response;
				var destination = "http://www.filedropper.com/" + response.substr(response.lastIndexOf('=') + 1);
				rst.innerHTML = "File uploaded to: " +
															  destination + 
															  "</br><button class=\"button\" onclick=\"window.open('" + destination + "', '_blank', 'location=yes')\">Open Location</button>";
				document.getElementById("downloadedImage").style.display="none";
			}
        
			function onFileTransferFail (error) {
				console.log("FileTransfer Error:");
				console.log("Code: " + error.code);
				console.log("Source: " + error.source);
				console.log("Target: " + error.target);
			}
		}
	}
}