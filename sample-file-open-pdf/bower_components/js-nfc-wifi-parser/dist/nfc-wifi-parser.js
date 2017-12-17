//parsing according to https://android.googlesource.com/platform/packages/apps/Nfc/+/master/src/com/android/nfc/NfcWifiProtectedSetup.java
//additions according to WIFi Alliance Wi-Fi Protected Setup Specification

var loadModule = function () {
  'use strict';
  var debug = false;
  var CREDENTIAL_FIELD_ID = parseInt('0x100E', 16);
  var SSID_FIELD_ID = parseInt('0x1045', 16);
  var NETWORK_KEY_FIELD_ID = parseInt('0x1027', 16);
  var AUTH_TYPE_FIELD_ID = parseInt('0x1003', 16);
  var NETWORK_INDEX_ID = parseInt('0x1026', 16);
  var ENCRYPTION_TYPE_ID = parseInt('0x100F', 16);
  var MAC_ADDRESS_ID = parseInt('0x1020', 16);

  var AUTH_TYPE_OPEN = 0;
  var AUTH_TYPE_WPA_PSK = parseInt('0x0002', 16);
  var AUTH_TYPE_WPA_EAP = parseInt('0x0008', 16);
  var AUTH_TYPE_WPA2_EAP = parseInt('0x0010', 16);
  var AUTH_TYPE_WPA2_PSK = parseInt('0x0020', 16);

  var AUTH_TYPE_EXPECTED_SIZE = 2;

  var bin2string = function (array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
      result += (String.fromCharCode(array[i]));
    }
    return result;
  };
  var parseCredential = function (bytes, payload, size, position) {
    var result = {};
    var startPosition = position;
    while (position < startPosition + size) {
      var fieldId = payload.getUint16(position);
      position = position + 2;
      var fieldSize = payload.getUint16(position) & 65535;
      position = position + 2;
      // sanity check
      if (position + fieldSize > startPosition + size) {
        return null;
      }

      switch (fieldId) {
        case SSID_FIELD_ID:
          result.ssid = bin2string(bytes.slice(position, position + fieldSize));
          if (debug) {
            console.log('ssid: ' + result.ssid);
          }
          break;
        case NETWORK_KEY_FIELD_ID:
          result.preSharedKey = bin2string(bytes.slice(position, position + fieldSize));
          if (debug) {
            console.log('sharedkey: ' + result.preSharedKey);
          }
          break;
        case AUTH_TYPE_FIELD_ID:
          if (fieldSize != AUTH_TYPE_EXPECTED_SIZE) {
            // corrupt data
            if (debug) {
              console.log('corrupt data');
            }
            return null;
          }
          // BITWISE OR CHECK console.log(AUTH_TYPE_WPA_PSK | AUTH_TYPE_WPA2_PSK)
          var authType = payload.getUint16(position);

          if (authType & AUTH_TYPE_WPA_PSK || authType & AUTH_TYPE_WPA2_PSK) {
            result.authType = 'WPA_PSK';
          } else if (authType & AUTH_TYPE_WPA_EAP || authType & AUTH_TYPE_WPA2_EAP) {
            result.authType = 'WPA_EAP';
          } else if (authType & AUTH_TYPE_OPEN) {
            result.authType = 'NONE';
          }

          if (debug) {
            console.log('authtype: ' + result.authType);
          }
          break;
        case NETWORK_INDEX_ID:
          result.networkIndexId = payload.getUint8(position);
          if (debug) {
            console.log('networkIndexId: ' + result.networkIndexId);
          }
          break;
        case ENCRYPTION_TYPE_ID:
          result.encryptionTypeId = payload.getUint16(position);
          if (debug) {
            console.log('encryptionTypeId: ' + result.encryptionTypeId);
          }
          break;
        case MAC_ADDRESS_ID:
          result.macAddressId = bytes.slice(position, position + fieldSize);
          if (debug) {
            console.log('macAddressId: ' + result.macAddressId.reduce(function (a, b) {
                return a.toString(16) + ':' + b.toString(16);
              }));
          }
          break;
        default:
          // unknown
          if (debug) {
            console.log(fieldId + ': fieldsize is ' + fieldSize);
          }
          break;
      }
      position = position + fieldSize;
    }
    return result;
  };

  var nfcWifiParser = {
    parseBytes: function (bytes, callback) {
      try {
        var u8 = new Uint8Array(bytes);
        var position = 0;
        var dv = new DataView(u8.buffer);
        var fieldId = dv.getUint16(position);
        position = position + 2;
        var fieldSize = dv.getUint16(position) & 65535;
        position = position + 2;
        var result = parseCredential(bytes, dv, fieldSize, position);
        callback(null, result);
      }
      catch (err) {
        callback(err, null);
      }
    }
  };

  return nfcWifiParser;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = loadModule();
} else if (typeof window !== 'undefined') {
  if (!window.nfcWifiParser) {
    window.nfcWifiParser = loadModule();
  } else {
    console.log("Library already defined.");
  }
} else {
  if (!this.nfcWifiParser) {
    this.nfcWifiParser = loadModule();
  } else {
    console.log("Library already defined.");
  }
}