var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Monq = require('monq');

var Queue = function( config ) {
  var self = this;

  if (!config) var config = { database: {} };
  if (typeof config === 'string') var config = { database: { name: config } };

  config.database = {
    host: config.database.host || 'localhost',
    port: config.database.port || '27017',
    name: config.database.name || 'maki-queue'
  };

  self._monq = Monq('mongodb://'+ config.database.host +':'+ config.database.port +'/' + config.database.name );
  self._jobs = self._monq.queue( config.database.name );

  self.Worker = function( dbName ) {
    var me = this;
    if (!dbName) var dbName = config.database.name;
    if (typeof(dbName) === 'string') var dbName = [ dbName ];

    me._worker = self._monq.worker( dbName );

    // TODO: consider attaching only on start?
    me._worker.on('dequeued', function (data) {
      me.emit( 'dequeued', data );
    });
    me._worker.on('failed', function (data) {
      me.emit( 'failed' , data );
    });
    me._worker.on('complete', function (data) {
      me.emit( 'complete' , data );
    });
    me._worker.on('error', function (err) {
      me.emit( 'error' , err );
    });

  };

  util.inherits( self.Worker , EventEmitter );

  self.Worker.prototype.register = function( processors ) {
    this._worker.register( processors );
  }

  self.Worker.prototype.start = function( cb ) {
    if (!cb) var cb = new Function();
    this._worker.start();
    cb();
  }

};

Queue.prototype.enqueue = function( type , data , cb ) {
  this._jobs.enqueue( type , data , cb );
};

Queue.prototype.bind = function( app ) {
  app._jobs = this._monq;

  return app;
};

module.exports = Queue;
