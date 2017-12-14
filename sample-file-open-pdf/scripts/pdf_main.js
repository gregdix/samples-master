//Activate :active state
document.addEventListener("touchstart", function() {}, false);

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	document.getElementById('btnOpenPDF').onclick = function() {
		var app = new Application();
		app.run();
	}

	navigator.splashscreen.hide();
}

function Application() {
}

Application.prototype = {
	run : function() {
		var pdfFileName = "sample.pdf",
			samplePdfUrl;

		if (window.navigator.simulator === true) {
			alert("Not Supported in Simulator.");
		} else {
			if (device.platform.toLowerCase() === "android") {
				// file:///storage/emulated/0/Android/data/<app-id>/files/
				// Directory has to be public, for the default pdf viewer to read it.
				samplePdfUrl = cordova.file.externalDataDirectory + pdfFileName;

				// Check whether the sample PDF file exists.
				window.resolveLocalFileSystemURL(
					samplePdfUrl,
					loadPdfFromFileEntry,
					function (error) {
						copyFile(
							getWorkingFolderFileURL(pdfFileName),
							samplePdfUrl,
							loadPdfFromFileEntry,
							function(error) {
								alert("Error copying file.");
								console.log("Error: " + JSON.stringify(error, null, 4));
							});
					});
			} else {
				samplePdfUrl = getWorkingFolderFileURL(pdfFileName);
				loadPdf(samplePdfUrl);
			}
		}
	},
}

function getWorkingFolderURL() {
	var indexUrl = window.location.href;
	return indexUrl.substring(0, indexUrl.indexOf("index.html"));
}

function getWorkingFolderFileURL(filePath) {
	return getWorkingFolderURL().replace("http://", "file://") + filePath;
}

function loadPdf(targetUrl) {
	var infoDiv = document.getElementById("infoField"),
		windowTarget = device.platform.toLowerCase() === "ios" ? "_blank" : "_system";
		
	infoDiv.textContent = "Path: " + targetUrl;
	console.log("Loading PDF file from: " + targetUrl);

	window.open(targetUrl, windowTarget, "location=yes,hidden=no");
}

function loadPdfFromFileEntry(fileEntry) {
	loadPdf(fileEntry.toURL());	
}

function copyFile(sourceUri, targetUri, successFunction, errorFunction) {
	var fileTransfer = new FileTransfer();
	
	console.log("Copying PDF file from: " + sourceUri + " to: " + targetUri);	

	fileTransfer.download(
		encodeURI(sourceUri),
		encodeURI(targetUri),
		successFunction,
		errorFunction);
}
