var should = require('chai').should();
var assert = require('assert');

describe('Queue', function() {
  describe('#Queue', function() {
    it('should expose a constructor', function(done) {
      var Queue = require('../');

      assert.equal( typeof(Queue) , 'function' );

      done();
    });
  });
});