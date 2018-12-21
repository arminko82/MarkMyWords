"use strict";
/* eslint-disable no-undef */

const isChrome = typeof chrome != "undefined";
const expect = isChrome ? chai.expect : require("chai").expect;
const assert = isChrome ? chai.assert : require("chai").assert;
const mmw = isChrome ? MarkMyWords : require("../main.js");

if(!isChrome) {
	require("jsdom-global")(); // creates js-dom	
}

var _fileNames = ["tdd1.html", "tdd1b.html"].map(function (f) { return "test/" + f;});
var _htmlFiles = {};

describe("MarkMyWords should be found and helper should work", function() {
	it("should exist", function() {
		expect(mmw).to.not.be.undefined;
	});

	if(isChrome) {
		it("should be able to read and buffer html files for next tests", function() {
			for (var fileName of _fileNames) {
				var file = require("fs").readFileSync(fileName);
				expect(file.length).to.be.above(0);
				_htmlFiles[fileName] = file;
			}
		});
	}

	it("should make a highlighted version of a text as HTML fragment", function() {
		var input = "Foo";
		var expected = "<mark>" + input + "</mark>";
		var actual = mmw.makeMarkNode(input).outerHTML;
		expect(actual).to.equal(expected);
	});

	it("should create a shallow copy of all DOM nodes in given document's body", function() {
		var input = ["<p>Hello world</p>", "<p>Hello my world</p>", "<p></p>"];
		document.body.innerHTML = input.join(); // document from jsdom-global
		var expected = input;
		var actual = mmw.getShallowElementsCopy(document.body);
		var actualStrings = actual.map(x => x.outerHTML);
		expect(actual).to.have.lengthOf(input.length);
		expect(actualStrings).to.deep.equal(expected);
	});

	it("should take some string that is the split by a selection word", function() {
		var selection = "world";
		var inputs = [ 
			"Hello world", 
			"Hello my world", 
			"Hello my world.", 
			"Hello world, this is my world", 
			"world, oh Hello world", 
			" my world",
			"world",
			"worldworld", 
			"world world",
			"world\tworld",
			"worldworldworldworld"];
		var splits = [ 
			["Hello ", null],
			["Hello my ", null], 
			["Hello my ", null, "."], 
			["Hello ", null, ", this is my ", null], 
			[null, ", oh Hello ", null], 
			[" my ", null], 
			[null], 
			[null, null],
			[null, " ", null],
			[null, "\t", null],
			[null, null, null, null]];
		assert(inputs.length === splits.length, "Test data error");
    
		for(var i = 0; i < inputs.length; i++) {
			const input = inputs[i];
			const expected = splits[i];
			const actual = mmw.splitOriginal(input, selection);
			expect(input).to.equal(actual.raw);
			expect(expected).to.deep.equal(actual.out);
		}
		expect(mmw.splitOriginal("keinewelt", selection)).to.be.null;
		expect(mmw.splitOriginal("", selection)).to.be.null;
	});
});