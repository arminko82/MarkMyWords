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
		var selection = "wOrld".toLowerCase();
		var inputs = [
			"Hello world",
			"Hello my world",
			"Hello my world.",
			"Hello my World.",
			"Hello world, this is my world",
			"world, oh Hello world",
			" my world",
			"world",
			"worldworld",
			"world world",
			"world World",
			"world\tworld",
			"worldworldworldworld",
			", sed diam voluptua. At world vero eos et accusam et justo duo dolores et ea rebum. Stet"
		];
		var splits = [
			["Hello ", null],
			["Hello my ", null],
			["Hello my ", null, "."],
			["Hello my ", null, "."],
			["Hello ", null, ", this is my ", null],
			[null, ", oh Hello ", null],
			[" my ", null],
			[null],
			[null, null],
			[null, " ", null],
			[null, " ", null],
			[null, "\t", null],
			[null, null, null, null],
			[", sed diam voluptua. At ", null, " vero eos et accusam et justo duo dolores et ea rebum. Stet" ]
		];
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

describe('MarkUpNestedNodes', function() {
	it('should take a multiple html nodes and apply the highlight on all of them', function() {
		var highlight = "world";
		var inputs = [
			"<p>Hello <b>" + highlight+ "</b>.</p>",
			"<p>Hello <b>" + highlight+ "</b></p>",
			'<p>' + highlight + ' Lorem ipsum dolor sit amet, </p><p>consetetur sadipscing elitr, sed diam nonumy eirmod world world tempor </p>invidunt ut labore et <b>dolore</b> magna aliquyam <blockquote cite="http://dummy.com/foo.bar"><p>erat world</p></blockquote>, sed diam voluptua. At world vero eos et accusam et justo duo dolores et ea rebum. Stet <p>clita world kasd </p>gubergren, no sea takimata sanctus est Lorem ipsum dolor sit <b>world amet</b>.</p>',
			];
		var outputs = [
			"<p>Hello <b><mark>" + highlight+ "</mark></b>.</p>",
			"<p>Hello <b><mark>" + highlight+ "</mark></b></p>",
			'<p><mark>' + highlight + '</mark> Lorem ipsum dolor sit amet, </p><p>consetetur sadipscing elitr, sed diam nonumy eirmod <mark>world</mark> <mark>world</mark> tempor </p>invidunt ut labore et <b>dolore</b> magna aliquyam <blockquote cite="http://dummy.com/foo.bar"><p>erat <mark>world</mark></p></blockquote>, sed diam voluptua. At <mark>world</mark> vero eos et accusam et justo duo dolores et ea rebum. Stet <p>clita <mark>world</mark> kasd </p>gubergren, no sea takimata sanctus est Lorem ipsum dolor sit <b><mark>world</mark> amet</b>.</p>',
		];
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
describe('DetectUrlsInStrings', function () {
	it('should decide if a string is an url', function() {
		// test cases from https://mathiasbynens.be/demo/url-regex omiting unlikely urls
		var good = [
			"http://foo.com/blah_blah",
			"http://foo.com/blah_blah/",
			"http://foo.com/blah_blah_(wikipedia)",
			"http://foo.com/blah_blah_(wikipedia)_(again)",
			"http://www.example.com/wpstyle/?p=364",
			"https://www.example.com/foo/?bar=baz&inga=42&quux",
			"http://userid@example.com",
			"http://userid@example.com/",
			"http://userid@example.com:8080",
			"http://userid@example.com:8080/",
			"http://userid:password@example.com",
			"http://userid:password@example.com/",
			"ftp://foo.bar/baz",
			"http://142.42.1.1/",
			"http://142.42.1.1:8080/",
			"http://foo.com/blah_(wikipedia)#cite-1",
			"http://foo.com/blah_(wikipedia)_blah#cite-1",
			"http://foo.com/unicode_(✪)_in_parens",
			"http://foo.com/(something)?after=parens",
			"http://code.google.com/events/#&product=browser",
			"http://j.mp",
			"http://foo.bar/?q=Test%20URL-encoded%20stuff",
			"http://1337.net",
			"http://a.b-c.de",
			"http://223.255.255.254",
			"foo.com"
		];
		var bad = [
			"http://",
			"http://.",
			"http://..",
			"http://../",
			"http://?",
			"http://??",
			"http://??/",
			"http://foo.bar?q=Only the only is deemed part of the url",
			"http://#",
			"http://##",
			"http://##/",
			"//",
			"//a",
			"///a",
			"///",
			"http:///a",
			"rdar://1234",
			"h://test",
			"http:// shouldfail.com",
			":// should fail",
			"http://foo.bar/foo(bar)baz quux",
			"ftps://foo.bar/",
			"http://-error-.invalid/",
			"http://a.b--c.de/",
			"http://-a.b.co",
			"http://a.b-.co",
//			"http://1.1.1.1.1",
			"http://123.123.123",
			"http://3628126748",
			"http://.www.foo.bar/",
			"http://www.foo.bar./",
			"http://.www.foo.bar./"
		];
		for(var input of good)
			expect(mmw.isUrl(input), "URL: " + input).to.be.true;
		for(var input of bad)
			expect(mmw.isUrl(input), "URL: " + input).to.be.false;
	});
});

describe('DetectEmailsInStrings', function () {
	it('should decide if a string is an url', function() {
		// source anonfile
		var good = [
			"wita-strelka@freemail.ru",
			"ramedde2001@yahoo.com",
			"romassinkovski@yahoo.com",
			"patrickfigaji@yahoo.com",
			"saleh.rahimy@yahoo.com",
			"misa_cojocari@yahoo.com",
			"zazagejadze@yahoo.com",
			"marijamarinkovic25@yahoo.com",
			"ukrajinsky@yahoo.com",
			"finn_hudson11@yahoo.com",
			"buyer19722004@yahoo.com",
			"evanromadhoni16@yahoo.com",
			"diablo_93_cr@yahoo.com",
			"cecelbusiness@yahoo.com",
			"meto4jesus@yahoo.com",
			"taiwosworld4real@yahoo.com",
			"yemisi_ife@yahoo.com",
			"ahmadnawab15@yahoo.com",
			"danskspiller@yahoo.com",
			"temirma@yahoo.com",
			"lenovodell133@yahoo.com",
			"diana_d70000@yahoo.com",
			"o.nguyennguyen@yahoo.com",
			"anya_fedor@yahoo.com",
			"osborne_pinto@yahoo.com",
			"danimani_m34@yahoo.com",
			"skripkin@bmail.ru",
			"guitar_monic08@yahoo.com",
			"rinat_tver@yahoo.com",
			"asha_enterprises91@yahoo.com",
			"angel9198@gmail.com",
			"kushnatash@hotmail.com",
			"gravelinej@hotmail.com",
			"amelina.sveta2010@gmail.com",
			"lshaybova@hotmail.com",
			"aiona_jean@hotmail.com",
			"rezwan_butt@aol.com",
			"silkroad_kurdu_81_91a@aol.com",
			"haryoyo.piet@gmail.com",
			"kikivariki@aol.com",
			"sichov_96@gmail.com",
			"chaffron@gmail.com",
			"eslam_tarek64@yahoo.com",
			"ftigergs@yahoo.com",
			"bnorineru08@gmail.com",
			"bk.a.l.i.n@orange.fr",
			"credono@gmail.com",
			"deddiez07@aol.com",
			"dkellie.reed@hotmail.com",
			"bpinkas-s@yahoo.com",
			"a.ya.vladimir@yahoo.com",
			"jeromeazilis@yahoo.com",
			"caribou1@prodigy.net",
			"kitokatasm@gmail.com",
			"slonsw36@gmail.com",
			"aamberlopez@netscape.net",
			"heshamkamalksa@web.de"
		];
		var bad = [
			"bla",
			"",
			"11111111111111111111111111111111",
			"@",
			"@yahoo.com",
			"meep@"
		];
		for(var input of good)
			expect(mmw.isEmail(input), "URL: " + input).to.be.true;
		for(var input of bad)
			expect(mmw.isEmail(input), "URL: " + input).to.be.false;
	});
});

describe('TestMainEntryPointSimple', function () {
	it('invoke the main function of mmw successfully on a simple test case', function() {
		var foo = "Hello ";
		var bar = "world";
		var input = "<p>" + foo + bar + "</p>";
		var output = "<p>Hello <mark>world</mark></p>";

		var selection = window.getSelection();
		// register node and do selection programmatically
		root.innerHTML = input;
		var textNode = root.firstChild.firstChild;
		var range = document.createRange();
		range.setStart(textNode, foo.length);
		range.setEnd(textNode, foo.length + bar.length);
		selection.removeAllRanges();
		selection.addRange(range);

		mmw.updateSelection(null);
		var expected = output;
		var actual = root.innerHTML;
		expect(expected).to.equal(actual);
	});
});

describe('TestMainEntryPointAdvanced', function () {
	it('invoke the main function of mmw successfully on a more difficult test case', function() {
		var bar = "world";
		var input = '<p>' + bar + ' Lorem ipsum dolor sit amet, </p><p>consetetur sadipscing elitr, sed diam nonumy eirmod world world tempor </p>invidunt ut labore et <b>dolore</b> magna aliquyam <blockquote cite="http://dummy.com/foo.bar"><p>erat world</p></blockquote>, sed diam voluptua. At world vero eos et accusam et justo duo dolores et ea rebum. Stet <p>clita world kasd </p>gubergren, no sea takimata sanctus est Lorem ipsum dolor sit <b>world amet</b>.</p>';
		var output ='<p><mark>' + bar + '</mark> Lorem ipsum dolor sit amet, </p><p>consetetur sadipscing elitr, sed diam nonumy eirmod <mark>world</mark> <mark>world</mark> tempor </p>invidunt ut labore et <b>dolore</b> magna aliquyam <blockquote cite="http://dummy.com/foo.bar"><p>erat <mark>world</mark></p></blockquote>, sed diam voluptua. At <mark>world</mark> vero eos et accusam et justo duo dolores et ea rebum. Stet <p>clita <mark>world</mark> kasd </p>gubergren, no sea takimata sanctus est Lorem ipsum dolor sit <b><mark>world</mark> amet</b>.</p>';

		var selection = window.getSelection();
		root.innerHTML = input;
	    var textNode = root.firstChild.firstChild;
		var range = document.createRange();
		range.setStart(textNode, 0);
		range.setEnd(textNode, bar.length);
		selection.removeAllRanges();
		selection.addRange(range);

		mmw.updateSelection(null);
		var expected = output;
		var actual = root.innerHTML;
		expect(expected).to.equal(actual);
	});
});

describe('RestoreUncheckedState', function () {
	it('change tdd1 to tdd1b on using highlight function', function() {
		var input = _htmlFiles['tdd1.html'];
		var expected = _htmlFiles['tdd1b.html'];
		var actual = todo
	});
});
