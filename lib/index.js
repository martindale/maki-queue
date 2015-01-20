var util = require('util');
var EventEmitter = require('events').EventEmitter;

// TODO: remove dependency on Mongoose
var Agency = require('mongoose-agency');
var mongoose = require('mongoose');

var Queue = function( config ) {
  var self = this;

  if (!config) var config = { database: {} , options: {} };
  if (typeof config === 'string') var config = { database: { name: config } , options: {} };

  var options = config.options;

  config.database = {
    host: config.database.host || 'localhost',
    port: config.database.port || '27017',
    name: config.database.name || 'maki-queue'
  };
  
  self.db = mongoose.createConnection('mongodb://'+ config.database.host +':'+ config.database.port +'/' + config.database.name );
  self._jobs = new Agency( self.db , options );

  self.Worker = function( dbName ) {
    var me = this;
    if (!dbName) var dbName = config.database.name;
    if (typeof(dbName) === 'string') var dbName = [ dbName ];
    
    me._worker = new EventEmitter();

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
    Object.keys( processors ).forEach(function(jobType) {
      self._jobs.subscribe( jobType , processors[ jobType ] );
    });
  }

  self.Worker.prototype.start = function( cb ) {
    if (!cb) var cb = new Function();
    cb();
  }

};

Queue.prototype.enqueue = function( type , data , cb ) {
  this._jobs.publish( type , data , function(err) {
    
  });
  
  cb();
};

Queue.prototype.bind = function( app ) {
  app._jobs = this._jobs;

  return app;
};

module.exports = Queue;
