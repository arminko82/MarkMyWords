"use strict";

var expect = chai.expect;
var assert = chai.assert;
var mmw = MarkMyWords;

var _fileNames = ['tdd1.html', 'tdd1b.html'].map(function (f) { return "test/" + f});
var _htmlFiles = {};

var root =  document.getElementById("my-root");

describe('MarkMyWords', function() {
	it('should exist', function() {
		expect(mmw).to.not.be.undefined;
	});
});

describe('ShallowDomElementsCopy', function() {
	it('should create a shallow copy of all DOM nodes below my-root node in given document\'s body', function() {
		var input = ["<p>Hello world</p>", "<p>Hello my world</p>", "<p></p>"];
		root.innerHTML = input.join("");
		var expected = input;
		var actual = mmw.getShallowElementsCopy(root);
		var actualStrings = actual.map(x => x.outerHTML);
		expect(actual).to.have.lengthOf(input.length);
		expect(actualStrings).to.deep.equal(expected);
	});
});

describe('MarkUpCreation', function() {
	it('should make a highlighted version of a text as HTML fragment', function() {
		var input = "Foo";
		var expected = "<mark>" + input + "</mark>";
		var actual = mmw.makeMarkNode(input).outerHTML;
		expect(actual).to.equal(expected);
	});
});

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
			"<p>Hello my world. Hello my world.</p>", 
			"<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod world world tempor invidunt ut labore et dolore magna aliquyam erat world, sed diam voluptua. At world vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit world amet.</p>", 
			"<p></p><!-- is the child of this p null? -->"];
		var outputs = [ 
			"<p>Hello <mark>world</mark></p>", 
			"<p>Hello my <mark>world</mark></p>",
			"<p>Hello my <mark>world</mark>. Hello my <mark>world</mark>.</p>",
			"<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod <mark>world</mark> <mark>world</mark> tempor invidunt ut labore et dolore magna aliquyam erat <mark>world</mark>, sed diam voluptua. At <mark>world</mark> vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit <mark>world</mark> amet.</p>",
			"<p></p>"];
		var splits = [ 
			["Hello ", null],
			["Hello my ", null],
			["Hello my ", null, ". Hello my ", null, "."],
			["Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ", null, " ", null, " tempor invidunt ut labore et dolore magna aliquyam erat ", null, ", sed diam voluptua. At ", null, " vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit ", null, " amet."],
			null];
		assert(inputs.length === outputs.length, "Test data error");
		assert(inputs.length === splits.length, "Test data error");

		for(var i = 0; i < inputs.length; i++) {
			root.innerHTML = inputs[i];
			var expected = outputs[i];
			var p = root.firstChild;
			var node = p.firstChild;
			mmw.changeNode(node, highlight, splits[i]);
			var actual = p.outerHTML;
			expect(expected).to.equal(actual);
		}
	});
});

describe('RespectConfiguration', function () {
	it('should not react on changes if the extension is deactivated', function() {
		var states = [true, false, true].map(function(b) { return b.toString();});

		var originalState = localStorage[ENABLED_ID];
		for(var i = 0; i < states.length; i++) {
			var input = states[i];
			var expected = states[i];
			localStorage[ENABLED_ID] = input;
			var actual = MarkMyWords.isEnabled().toString();
			expect(expected).to.equal(actual);
		}
		localStorage[ENABLED_ID] = originalState;
	});
});


describe('RestoreUncheckedState', function () {
	it('change tdd1 to tdd1b on using highlight function', function() {
		var input = _htmlFiles['tdd1.html'];
		var expected = _htmlFiles['tdd1b.html'];
		var actual = todo
	});
});
