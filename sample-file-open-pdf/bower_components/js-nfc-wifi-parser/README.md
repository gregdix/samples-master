![npm badge](https://nodei.co/npm/js-nfc-wifi-parser.png)

# js-nfc-wifi-parser
parsing library for NFC WiFi application/vnd.wfa.wsc Mimetype Tags according to WiFi Alliance

The library is based on the Google Android Implementation according to WiFi Alliance Wi-Fi Protected Setup Specification.
The Google Source can be found here: 
* https://android.googlesource.com/platform/packages/apps/Nfc/+/android-6.0.1_r5/src/com/android/nfc/NfcWifiProtectedSetup.java

Unfortunately the specification documentation provided by the WiFi Alliance is not publically available, but some information on the tag format can be found here:

* http://stackoverflow.com/a/30248480/493726
* http://tagstand.com/nfc-user-guide/wi-fi-access-nfc-tag/

Googling around should help you find the official document, the title is "Wi-Fi Protected Setup Specification Version 1.0h"

# Try it

Check out https://repl.it/E4HO/65 where a working copy of the source code can be played around with.

## Usage
Simply inlude via

```html
<script src="bower_components/js-nfc-wifi-parser/dist/nfc-wifi-parser.js"></script>
```

or via

```javascript
var nfcWifiParser = require('js-nfc-wifi-parser');
```

and use with

```javascript
var nfcPayload = [16, 14, 0, 62, 16, 38, 0, 1, 1, 16, 69, 0, 11, 87, 76, 65, 78, 45, 56, 50, 67, 81, 90, 54, 16, 3, 0, 2, 0, 34, 16, 15, 0, 2, 0, 12, 16, 39, 0, 16, 52, 57, 53, 54, 52, 52, 53, 54, 56, 48, 51, 57, 48, 50, 54, 51, 16, 32, 0, 6, -1, -1, -1, -1, -1, -1];

nfcWifiParser.parseBytes(nfcPayload, function (err, result) {
        console.log(result);
        done();
      })
```
