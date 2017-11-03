	var Options;
	(function (Options) {
			var id = "mmw-enabled";
	    var storeKey = id;
	    var checkbox = document.getElementById(id);
	    restoreState();
	    checkbox.onclick = saveState;
	
	    function restoreState() {
	        if (localStorage[storeKey] !== undefined) {
	            checkbox.checked = localStorage[storeKey] === "true";
	        }
	    }
	
	    function saveState() {
	    		localStorage[storeKey] = checkbox.checked.toString();	
	        var status = document.getElementById("canvas");
	        status.innerHTML = "Stored";
	        setTimeout(function () {
	            status.innerHTML = "";
	        }, 1000);
	    }
	})(Options || (Options = {}));