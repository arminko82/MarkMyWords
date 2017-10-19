"use strict";

var expect = require('chai').expect;

describe('MarkMyWords', function() {
    it('should exist', function() {
        var MarkMyWords = require('../main.js');
        expect(MarkMyWords).to.not.be.undefined;
    });
});