"use strict";

// global init
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
	afterDOMLoaded();
}

// selection detector init
function afterDOMLoaded() {
	document.addEventListener("mouseup", updateSelection);
	document.addEventListener("dblclick", updateSelection);
}

var _lastText = "";
// keep track of highlight nodes TODO
var mHighlights = {};

// Remove highlight nodes on refresh TODO
function clearHighlights() {
	//for (tag in mHighlights) {
	//	console.log(tag.Parent);
	//}
}

function updateSelection(e) {
	var selection = window.getSelection(); 
	var text = selection.toString();
	if (text === "" || text === _lastText || text.match(/\s+/g))
		return;
	_lastText = text;
	clearHighlights();
	var range = selection.getRangeAt(0);
	selection.removeAllRanges(); // clear
	doHighlight(text);
	selection.addRange(range);
}

function doHighlight(selection) {
	for (var item of getShallowElementsCopy()) {
		var child = item.firstChild;
		if(child == null)
			continue; // empty tag
		var val = child.nodeValue;
		if (val == null || typeof val !== 'string')
			continue;
		var splits = val.split(selection);
		if(splits.length == 1 && splits[0] === selection)
			continue; // no highlight in this node
		changeNode(child, selection, splits);
	}
}

function changeNode(node, selection, splits ) {
	var highNode = makeMarkNode(selection);
	var master = node.parentNode;
	var textFragment = splits[0];
	if(textFragment.length > 0)
		node.nodeValue = textFragment;
	else
		master.removeChild(node);
	for (var i = 1; i < splits.length; i++) {
		master.appendChild(highNode);
		textFragment = splits[i];
		if(textFragment.length > 0)
			master.appendChild(document.createTextNode(textFragment));
	}			
}

function makeMarkNode(text) {
	var markNode = document.createElement("mark");
	var markText = document.createTextNode(text);
	markNode.appendChild(markText);
	return markNode;
}

//there is no slice on non array-type returned by getElementsByTagName
function getShallowElementsCopy() {
	var elements = document.body.getElementsByTagName("*");
	var array = new Array(elements.length);
	for(var i = 0; i < elements.length;i++)
		array[i] = elements[i];
	return array;
}