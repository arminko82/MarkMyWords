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

function makeHighNode(text) {
	var markNode = document.createElement("mark");
	var markText = document.createTextNode(text);
	markNode.appendChild(markText);
	return markNode;
}

function doHighlight(selection) {
	var replacement = "<mark>" + selection + "</mark>";
	//var pattern = "[^<](" + selection + ")[^>]"; // omit tags
	var pattern = selection; 
	var matcher = new RegExp(pattern, 'g');
	
	var items = document.body.getElementsByTagName("*").slice();
	for (item in items) {
		var c = item.firstChild;
		if(c == null)
			continue; // never happens? set bb
		var val = c.nodeValue;
		if (val != null && typeof val === 'string' || val instanceof String) {
			// assume single child now
			var splits = val.split(pattern);
			if(splits.length == 1)
				continue; // no highlight in this node
			c.nodeValue = splits[0];
			var highNode = makeHighNode(selection);
			for(i = 1; i < splits.length; i++) {
				item.appendChild(highNode);
				item.appendChild(document.createTextNode(splits[i]));
			}			
			//c.nodeValue = c.nodeValue.replace(pattern, replacement);
		}
	}
/*	var node = document.getElementsByTagName('body')[0];
	var all = node.innerHTML;
	node.innerHTML = all.replace(pattern, replacement);
	var newAll  = node.innerHTML;
	console.log("n"); */
	//var elems = document.querySelectorAll(selection), i;
	// TODO fix matcher
	//for (i = 0; i < elems.length; i++)
	//	if (!elems[i].childNodes.length)
	//		elems[i].innerHTML = elems[i].innerHTML.replace(matcher, newText);
}