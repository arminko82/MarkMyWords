"use strict";

const ENABLED_ID = "mmw-enabled";

/**
 * Encompasses all of the highligh logic and DOM manipulation.
 */
class MarkMyWords {
	/**
	 * Either does a new selection, changes the selection or reacts un unselection.
	 * Restores the original state before the last selection update and applies
	 * the new highlights according to the new selection.
	 */
	static updateSelection(e,root = document.body) {
		if(chrome !== undefined && chrome.storage !== undefined) {
			chrome.storage.local.get(ENABLED_ID, function(v) {
				var value = v[ENABLED_ID];
				if (value !== undefined && !value)
					return; // we are deliberatly disabled by options
				MarkMyWords.doUpdateSelection(e, root);
			});
		} else {
			MarkMyWords.doUpdateSelection(e, root);
		}
	}

	/**
	 * Performs the job of updateSelection if either a chrome local store is found
	 * and the settings could be read or if no store is present (dev mode).
	 */
	static doUpdateSelection (e, root) {
		var selection = window.getSelection();
		var text = selection.toString().trim();
		if (text === "" || text === this._lastText || text.match(/\s+/g) ||
				MarkMyWords.isUrl(text) || MarkMyWords.isEmail(text))
			return;
		MarkMyWords._lastText = text;
		MarkMyWords.clearHighlights();
		var range = selection.getRangeAt(0);
		selection.removeAllRanges(); // clear
		MarkMyWords.doHighlight(text.toLowerCase(), root);
		selection.addRange(range);
	}

	/**
	 * Undoes previous highlight by restoring node states.
	 */
	static clearHighlights() {
		if(MarkMyWords._highlights.length == 0)
			return;
		for(var tuple of MarkMyWords._highlights) {
			var master = tuple.parent;
			if(master.parentNode === null)
				continue; // master not part of DOM anymore
			var original = tuple.original;
			while(master.lastChild)
				master.removeChild(master.lastChild);
			master.appendChild(document.createTextNode(original));
		}
		MarkMyWords._highlights = [];
	}

	/**
	 * Determines what to highlight and invokes the node changes.
	 */
	static doHighlight(selection, root) {
		var textNodes = MarkMyWords.getAllTextNodes(root);
		for (var child of textNodes) {
			var item = child.parentNode;
			var text = child.nodeValue;
			if(text.match(/<\/?\w+>/g))
				throw "HTML elements in text not allowed!";
			var splits = MarkMyWords.splitOriginal(text, selection);
			MarkMyWords._highlights.push({ parent: item, original: splits.raw});
			MarkMyWords.changeNode(child, selection, splits.out);
		}
	}

	/**
	 * If input is a string (among html nodes) split it by selection.
	 * @return: null on nothing, array of length 1 with original string
	 * on not finding selection, array of substring, the place of each
	 * entry being null is place for marked text afterwards.
	 */
	static splitOriginal(val, selection) {
		var indices = [];
		var i = -1;
		var test = val.toLowerCase();
		while((i = test.indexOf(selection, i + 1) ) >= 0)
			indices.push(i);
		if(indices.length === 0)
			return { raw: val, out: [val] };
		var result = [];
		var index = 0;
		var i = 0;
		if(indices[0] === 0) {
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
		master.removeChild(node); //ich denke hier werden mehrere kinder möglch sein, deshalb reversing
		MarkMyWords._highlights[master] = node;
		for(var item of splits) {
			master.appendChild(item === null ?
				MarkMyWords.makeMarkNode(selection, dom) :
				dom.createTextNode(item));
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
	static getAllTextNodes(node) {
		const ELEM_NODE = 1;
		const TEXT_NODE = 3;
		var result = [];

		function searcher(node, result) {
			for(var child of node.childNodes) {
				switch(child.nodeType) {
				case ELEM_NODE:
					searcher(child, result);
					break;
				case TEXT_NODE:
					result.push(child);
					break;
				}
			}
		}
		searcher(node, result);
		return result;
	}

	/**
	 *  Returns boolean true if the given text seems to be an url.
	 */
	static isUrl(text) {
		const pattern = /^((http(s)?|ftp)?:\/\/)?([a-z0-9]+(:[a-z0-9]+)?@)?((www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(:\d{1,5})?([^\s.]+)?$/gmi;
		return pattern.test(text);
	}

	/**
	 *  Returns boolean true if the given text seems to be an email address.
	 *  From http://emailregex.com/
	 */
	static isEmail(text) {
		const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim;
		return pattern.test(text);
	}
} // end class MarkMyWords
MarkMyWords._highlights = [];
MarkMyWords._lastText = "";

//set default value if was never set before (is there a setup routine for a chrome extension?)
if(typeof chrome !== "undefined") {
	if(chrome !== undefined && chrome.storage !== undefined) {
		chrome.storage.local.get(ENABLED_ID, function (v){
			var value = v[ENABLED_ID];
			if (value === undefined)
				chrome.storage.local.set({[ENABLED_ID]: true});
		});
	}
}

//global init
if(typeof document !== "undefined") { // not defined in test env
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", afterDOMLoaded);
	} else {
		afterDOMLoaded();
	}
}

//selection detector init
function afterDOMLoaded() {
	document.addEventListener("mouseup", MarkMyWords.updateSelection);
	document.addEventListener("dblclick", MarkMyWords.updateSelection);
}

//render this class requireable
if(typeof module !== "undefined") {
	module.exports = MarkMyWords;
}
