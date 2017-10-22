"use strict";

require('jsdom-global')()

var expect = require('chai').expect;
var assert = require('chai').assert;
var cheerio = require('cheerio');
var fs = require('fs');
var mmw = require('../main.js');

var _fileNames = ['tdd1.html', 'tdd1b.html'].map(function (f) { return "test/" + f});
var _htmlFiles = {};

describe('MarkMyWords', function() {
    it('should exist', function() {
        expect(mmw).to.not.be.undefined;
    });
});

describe('ReadTestFiles', function () {
	it('should be able to read and buffer html files for next tests', function() {
		for (var fileName of _fileNames) {
			var file = fs.readFileSync(fileName)
			expect(file.length).to.be.above(0);
			_htmlFiles[fileName] = file;
		}
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

describe('ShallowDomElementsCopy', function() {
    it('should create a shallow copy of all DOM nodes in given document\'s body', function() {
    		var input = ["<p>Hello world</p>", "<p>Hello my world</p>", "<p></p>"];
        document.body.innerHTML = input.join(); // document from jsdom-global
        var expected = input;
        var actual = mmw.getShallowElementsCopy();
        var actualStrings = actual.map(x => x.outerHTML);
        expect(actual).to.have.lengthOf(input.length);
        expect(actualStrings).to.deep.equal(expected);
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

		assert(inputs.length !== outputs.length, "Test data error");
    
        var p = document.createElement('p');
        var text = document.createTextNode("Hello ");
        var mark = document.createElement('mark');
        var markText = document.createTextNode(highlight);
        mark.appendChild(markText);
        p.appendChild(text);
        p.appendChild(mark);

		var input = "<p>Hello " + highlight + "</p>";
        document.body.innerHTML = input;
        var expected = p.outerHTML;
        mmw.changeNode(document.body.firstChild, highlight, ["Hello ", highlight]);
        var actual = document.body.innerHTML;
        
        expect(expected).to.equal(actual);
    });
});



describe('MarkWorldInTdd1', function () {
	it('change tdd1 to tdd1b on using highlight function', function() {
		var input = _htmlFiles['tdd1.html'];
		var expected = _htmlFiles['tdd1b.html'];
		var actual = todo
	});
});