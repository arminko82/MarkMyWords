"use strict";

class MarkMyWords {
	// define class member
	constructor() {
	//	MarkMyWords._lastText = "";
	//	MarkMyWords._highlights = {};
	}

	// Remove highlight nodes on refresh TODO
	static clearHighlights() {
		var shit = 'shat';
		// for (tag in this._highlights) {
		// console.log(tag.Parent);
		// }
	}
	
	static updateSelection(e) {
		var selection = window.getSelection(); 
		var text = selection.toString();
		if (text === "" || text === this._lastText || text.match(/\s+/g))
			return;
		MarkMyWords._lastText = text;
		MarkMyWords.clearHighlights();
		var range = selection.getRangeAt(0);
		selection.removeAllRanges(); // clear
		MarkMyWords.doHighlight(text);
		selection.addRange(range);
	}
	
	static doHighlight(selection) {
		for (var item of MarkMyWords.getShallowElementsCopy()) {
			var child = item.firstChild;
			if(child == null)
				continue; // empty tag
			var val = child.nodeValue;
			if (val == null || typeof val !== 'string')
				continue;
			var splits = val.split(selection);
			if(splits.length == 1 && splits[0] === selection)
				continue; // no highlight in this node
			// this._highlights[] // save old node
			MarkMyWords.changeNode(child, selection, splits);
		}
	}
	
	static changeNode(node, selection, splits ) {
		var highNode = MarkMyWords.makeMarkNode(selection);
		var master = node.parentNode;
		var textFragment = splits[0];
		node.nodeValue = textFragment.length > 0 ? textFragment : "";
		for (var i = 1; i < splits.length; i++) {
			master.appendChild(highNode);
			textFragment = splits[i];
			if(textFragment.length > 0)
				master.appendChild(document.createTextNode(textFragment));
		}			
	}
	
	static makeMarkNode(text) {
		var markNode = document.createElement("mark");
		var markText = document.createTextNode(text);
		markNode.appendChild(markText);
		return markNode;
	}
	
	// there is no slice on non array-type returned by getElementsByTagName
	static getShallowElementsCopy() {
		var elements = document.body.getElementsByTagName("*");
		var array = new Array(elements.length);
		for(var i = 0; i < elements.length;i++)
			array[i] = elements[i];
		return array;
	}
} // end class
MarkMyWords._highlights = {};
MarkMyWords._lastText = "";


//global init
if(typeof document !== 'undefined') { // not defined in test env
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', afterDOMLoaded);
	} else {
		afterDOMLoaded();
	}
}

// selection detector init
function afterDOMLoaded() {
	//var mmw = new MarkMyWords();
	document.addEventListener("mouseup", MarkMyWords.updateSelection);
	document.addEventListener("dblclick", MarkMyWords.updateSelection);
}

// render this class requireable
if(typeof module !== 'undefined') {
	module.exports = MarkMyWords;
}