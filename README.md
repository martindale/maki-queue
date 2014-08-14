# Getting Started

## Quick Start

Implementing Maki's Queue is easy:

1.  `npm install maki-queue`
2.  Queue jobs from your application:  
  ```javascript
  var Queue = require('maki-queue');
  var queue = new Queue();
  
  queue.enqueue('job-type', {
    // job data
    foo: 'bar'
  }, function(err) {
    // handle errors
  });
  ```
3.  Process jobs from a worker (`worker.js`):  
  ```javascript
  var Queue = require('maki-queue');
  var queue = new Queue();

  // create the worker
  var worker = new queue.Worker('your-application');

  // register job handlers
  worker.register({
    'job-type': function( data , jobIsDone ) {
      // do work (in this test case, just log it out)
      console.log( data );
      // mark job as complete
      jobIsDone();
    }
  });

  // start the worker
  worker.start();
  ```