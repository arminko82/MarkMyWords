"use strict";

var expect = require('chai').expect;
var assert = require('chai').assert;
var cheerio = require('cheerio');
var fs = require('fs');

var htmlFiles = {};

describe('MarkMyWords', function() {
    it('should exist', function() {
        var MarkMyWords = require('../main.js');
        expect(MarkMyWords).to.not.be.undefined;
    });
});

describe('ReadTestFiles', function () {
	var fileNames = ['tdd1.html', 'tdd1b.html'];
	it('should be able to read and buffer html files for next tests', function() {
		for (var fileName of fileNames) {
			var file = fs.readFileSync('test/' + fileName)
			expect(file.length > 0).to.be.true;
			htmlFiles[fileName] = file;
		}
	});
});

describe('MarkupCreation', function() {
    it('should make a highlighted version of a text', function() {
        var input = "Foo";
        var expected = "<mark>Foo</mark";
        var actual = makeMarkNode(input);
        expect(expected === actual).to.be.true;
    });
});


describe('MarkWorldInTdd1', function () {
	it('change tdd1 to tdd1b on using highlight function', function() {
		var input = htmlFiles['tdd1.html'];
		var expected = htmlFiles['tdd1b.html'];
		var actual = todo
	});
});