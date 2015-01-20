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
    
    it('should instantiate a queue with a string name', function(done) {
      var Queue = require('../');
      var queue = new Queue('some-other-database');
      
      done();
    });

    it('should allow jobs to be created', function(done) {
      var Queue = require('../');
      var queue = new Queue();

      queue.enqueue('test', {
        foo: 'bar'
      }, function(err) {
        assert.equal( err , null );
        done();
      });

    });
    
    it('should bind to an app', function() {
      var Queue = require('../');
      var queue = new Queue();
      
      var app = {};
      
      queue.bind( app );
      
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
    
    it('should instantiate a worker without a name', function(done) {
      var Queue = require('../');
      var queue = new Queue();
      
      var worker = new queue.Worker();
      
      done();
    });

    it('should process new jobs', function(done) {
      var Queue = require('../');
      var queue = new Queue();

      var worker = new queue.Worker( config.database.name );
      var jobWasRun = false;

      worker.register({
        'test': function( data , jobIsDone ) {
          jobWasRun = true;
          jobIsDone();
        }
      });

      worker.start();

      queue.enqueue('test', {
        foo: 'bar'
      }, function(err) {});

      var tester = setInterval(function() {
        if (jobWasRun === true) {
          clearInterval( tester );
          done();
        }
      }, 10);

    });
    
    it('should emit a startup callback', function(done) {
      var Queue = require('../');
      var queue = new Queue();
      
      var worker = new queue.Worker();
      worker.start( done );
    });
    
  });
});
