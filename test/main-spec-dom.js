"use strict";

var expect = chai.expect;
var assert = chai.assert;
var mmw = MarkMyWords;

var _fileNames = ['tdd1.html', 'tdd1b.html'].map(function (f) { return "test/" + f});
var _htmlFiles = {};

describe('MarkMyWords', function() {
    it('should exist', function() {
        expect(mmw).to.not.be.undefined;
    });
});

describe('MarkUpCreation', function() {
    it('should make a highlighted version of a text as HTLM fragment', function() {
        var input = "Foo";
        var expected = "<mark>" + input + "</mark>";
        var actual = mmw.makeMarkNode(input).outerHTML;
        expect(actual).to.equal(expected);
    });
});

/*

describe('SplitOriginalStrings', function() {
    it('should take some string that is the split by a selection word', function() {
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
			var input = inputs[i];
	        var expected = splits[i];
	        var actual = mmw.splitOriginal(input, selection);
	        	expect(input).to.equal(actual.raw);
	        	expect(expected).to.deep.equal(actual.out);
		}
		expect(mmw.splitOriginal("keinewelt", selection)).to.be.null;
		expect(mmw.splitOriginal("", selection)).to.be.null;
    });
});

describe('MarkUpSingleNodeText', function() {
    it('should take a single html node and apply the highlight on it', function() {
		var highlight = "world";
		var inputs = [ 
			"<p>Hello world</p>", 
			"<p>Hello my world</p>", 
			"<p></p><!-- is the child of this p null? -->"];
		var outputs = [ 
			"<p>Hello <mark>world</mark></p>", 
			"<p>Hello my <mark>world</mark></p>", 
			"<p></p><!-- is the child of this p null? -->"];
		var splits = [ 
			["Hello ", null],
			["Hello my ", null], 
			null];
		assert(inputs.length === outputs.length, "Test data error");
		assert(inputs.length === splits.length, "Test data error");
    
		for(var i = 0; i < inputs.length; i++) {
			var dom = new JSDOM(inputs[i]);
			var doc = dom.window.document;
	        var expected = outputs[i];
	        var node = doc.querySelector("p");
	        console.log(doc);
	        mmw.changeNode(node, highlight, splits[i], doc);
	        var actual = node.outerHTML;
	        expect(expected).to.equal(actual);
		}
    });
});

describe('MarkWorldInTdd1', function () {
	it('change tdd1 to tdd1b on using highlight function', function() {
		var input = _htmlFiles['tdd1.html'];
		var expected = _htmlFiles['tdd1b.html'];
		var actual = todo
	});
});
*/