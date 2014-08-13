var should = require('chai').should();
var assert = require('assert');

var config = {
  database: {
    name: 'maki-queue'
  }
}

describe('Queue', function() {
  describe('#Queue', function() {
    it('should expose a constructor', function(done) {
      assert.equal( typeof( require('../') ) , 'function' );
      done();
    });

    it('should instantiate a queue', function(done) {
      var Queue = require('../');
      var queue = new Queue();

      done();
    });
  });
  describe('#Worker', function() {
    it('should expose a constructor for the Worker', function(done) {
      var Queue = require('../');
      var queue = new Queue();

      assert.equal( typeof( queue.Worker ) , 'function' );
      done();
    });

    it('should instantiate a worker', function(done) {
      var Queue = require('../');
      var queue = new Queue();

      var worker = new queue.Worker( config.database.name );

      done();
    });
  });
});