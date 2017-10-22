"use strict";

require('jsdom-global')()

var expect = require('chai').expect;
var assert = require('chai').assert;
var cheerio = require('cheerio');
var fs = require('fs');
var mmw = require('../main.js');

var htmlFiles = {};

describe('MarkMyWords', function() {
    it('should exist', function() {
        expect(mmw).to.not.be.undefined;
    });
});

describe('ReadTestFiles', function () {
	var fileNames = ['tdd1.html', 'tdd1b.html'];
	it('should be able to read and buffer html files for next tests', function() {
		for (var fileName of fileNames) {
			var file = fs.readFileSync('test/' + fileName)
			expect(file.length).to.be.above(0);
			htmlFiles[fileName] = file;
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


describe('MarkWorldInTdd1', function () {
	it('change tdd1 to tdd1b on using highlight function', function() {
		var input = htmlFiles['tdd1.html'];
		var expected = htmlFiles['tdd1b.html'];
		var actual = todo
	});
});