"use strict";

/**
 * Encompasses all of the highligh logic and DOM manipulation.
 */
class MarkMyWords {

	/**
	 * Undoes previous highlight by restoring node states.
	 */
	static clearHighlights() {
		if(MarkMyWords._highlights.length == 0)
			return;
		for(var tuple of MarkMyWords._highlights) {
			var master = tuple.parent;
			var original = tuple.original;
			while(master.lastChild)
				master.removeChild(master.lastChild);
			master.appendChild(document.createTextNode(original));
		}
		MarkMyWords._highlights = [];
	}
	
	/**
	 * Either does a new selection, changes the selection or reacts un unselection.
	 * Restores the original state before the last selection update and applies
	 * the new highlights according to the new selection.
	 */
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
	
	/**
	 * Determines what to highlight and invokes the node changes.
	 */
	static doHighlight(selection) {
		for (var item of MarkMyWords.getShallowElementsCopy(document.body)) {
			var child = item.firstChild;
			if(child === null)
				continue; // empty tag
			var splits = MarkMyWords.splitOriginal(child.nodeValue, selection);
			if(splits === null)
				continue;
			this._highlights.push({ parent: item, original: splits.raw});
			MarkMyWords.changeNode(child, selection, splits.out);
		}
	}

	/**
	 * If input is a string (among html nodes) split it by selection.
	 * @return: null on nothing, array of substring, the place of each 
	 * entry being null is place for marked text afterwards.
	 */
	static splitOriginal(val, selection) {
		if (val == null || typeof val !== 'string')
			return null;
		var indices = [];
		var i = -1;
		while((i = val.indexOf(selection, i + 1) ) >= 0)
			indices.push(i);
		if(indices.length == 0)
			return null;
		var result = [];
		var index = 0;
		var i = 0;
		if(indices[0] == 0) {
			result.push(null); // val began with selection
			index = selection.length;
			i = 1;
		}
		for(i; i < indices.length; i++) {
			if(index != indices[i])
				result.push(val.substring(index, indices[i]));
			result.push(null); // signal placeholder for highlight
			index = indices[i] + selection.length;
		}
		if(index < val.length)
			result.push(val.substring(index));
		return { raw: val, out: result };
	}
	
	/**
	 * Alters a text node by replacing it by a series of nodes
	 * specified by splits. Each null in splits becomes a mark subnode,
	 * the rest texts.
	 */
	static changeNode(node, selection, splits, dom) {
		if(node == null || node.parentNode == null)
			return;
		if(dom == null)
			dom = document;
		var master = node.parentNode;
		master.removeChild(node);
		MarkMyWords._highlights[master] = node;
		for(var item of splits) {
			var entity = item == null ? 
				MarkMyWords.makeMarkNode(selection, dom) : 
				dom.createTextNode(item)
			master.appendChild(entity);
		}
	}
	
	/**
	 * Creates an highlight node with given text.
	 */
	static makeMarkNode(text, dom) {
		if(dom == null)
			dom = document;
		var markNode = dom.createElement("mark");
		var markText = dom.createTextNode(text);
		markNode.appendChild(markText);
		return markNode;
	}
	
	// there is no slice on non array-type returned by getElementsByTagName
	static getShallowElementsCopy(node) {
		var elements = node.getElementsByTagName("*");
		var array = new Array(elements.length);
		for(var i = 0; i < elements.length;i++)
			array[i] = elements[i];
		return array;
	}
} // end class MarkMyWords
MarkMyWords._highlights = [];
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
	document.addEventListener("mouseup", MarkMyWords.updateSelection);
	document.addEventListener("dblclick", MarkMyWords.updateSelection);
}

// render this class requireable
if(typeof module !== 'undefined') {
	module.exports = MarkMyWords;
}