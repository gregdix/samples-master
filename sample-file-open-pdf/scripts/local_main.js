document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    navigator.splashscreen.hide();
    localStorageApp = new localStorageApp();
    localStorageApp.run();
}

function localStorageApp() {
}

localStorageApp.prototype = {
    message: null,
    getRemoveVariableNameInput: null,

    run: function () {
        var that = this;

        message = document.getElementById("message");
        getRemoveVariableNameInput = document.getElementById("getRemoveVariableNameInput");

        document.getElementById("insertVariable").addEventListener("click", function () {
            that._insertVariable.apply(that, arguments);
        });
        document.getElementById("searchVariable").addEventListener("click", function () {
            that._getVariable.apply(that, arguments);
        });
        document.getElementById("clearLocalStorage").addEventListener("click", function () {
            that._clearLocalStorage.apply(that, arguments);
        });
        document.getElementById("removeVariable").addEventListener("click", function () {
            that._removeVariable.apply(that, arguments);
        });
    },


    _insertVariable: function () {
        var variableNameInput = document.getElementById("variableNameInput"),
		valueInput = document.getElementById("valueInput");

        localStorage.setItem(variableNameInput.value, valueInput.value);

        message.textContent = "Variable [" + variableNameInput.value + ", " + valueInput.value + "] added!";

        variableNameInput.value = "";
        valueInput.value = "";
    },

    _getVariable: function () {
        if (localStorage.getItem(getRemoveVariableNameInput.value) != undefined) {
            message.textContent = "Variable with name " + getRemoveVariableNameInput.value + " found!";
        }
        else {
            message.textContent = "No such record found.";
        }
    },

    _removeVariable: function () {
        if (localStorage.getItem(getRemoveVariableNameInput.value) != undefined) {
            localStorage.removeItem(getRemoveVariableNameInput.value);
            message.textContent = "Record deleted!";
        }
        else {
            message.textContent = "No such record found.";
        }
    },

    _clearLocalStorage: function () {
        localStorage.clear();
        message.textContent = "Storage is cleared!";
    }
}