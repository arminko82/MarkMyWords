var Options;
(function (Options) {
	var id = "mmw-enabled";
	var checkbox = document.getElementById(id);
	checkbox.onclick = saveState;
	restoreState();

	function restoreState() {
		chrome.storage.local.get(id, function (v){
			var value = v[id];
			if (value !== undefined) {
				checkbox.checked = value;
			}
		});  
	}

	function saveState() {
		chrome.storage.local.set({[id]: checkbox.checked}, function() {
			var status = document.getElementById("canvas");
			var err = chrome.runtime.lastError !== undefined;
			status.innerHTML = err ? "Error - nothing changed ..." : "Options stored.";
			setTimeout(function () {
				status.innerHTML = "";
			}, 3000);
			
		});
	}
})(Options || (Options = {}));