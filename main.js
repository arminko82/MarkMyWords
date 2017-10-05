// Init
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
	afterDOMLoaded();
}

//Handler
function afterDOMLoaded() {
	document.addEventListener("mouseup", updateSelection);
	document.addEventListener("dblclick", updateSelection);
}

// keep track of highlight nodes TODO
var mHighlights = {};

// Remove highlight nodes on refresh TODO
function clearHighlights() {
	//for (tag in mHighlights) {
	//	console.log(tag.Parent);
	//}
}

function getSelectionText() {
	var text = "";
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}
	return text;
}
function updateSelection(e) {
	clearHighlights();
	var selection = getSelectionText();
	if (selection === "")
		return;
	doHighlight(selection);

	console.log(e.target.nodeName);
	console.log("Text: " + getSelectionText());
}

function doHighlight(selection) {
	var replacement = "<mark>" + selection + "</mark>";
	var matcher = new RegExp(selection, 'g');
	var elems = document.querySelectorAll(selection), i;
	// TODO fix matcher
	for (i = 0; i < elems.length; i++)
		if (!elems[i].childNodes.length)
			elems[i].innerHTML = elems[i].innerHTML.replace(matcher, newText);
}