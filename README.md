Maki: Queue
===========
[![NPM Package](https://img.shields.io/npm/v/maki-queue.svg?style=flat-square)](https://www.npmjs.org/package/maki-queue)
[![Build Status](https://img.shields.io/travis/martindale/maki-queue.svg?branch=master&style=flat-square)](https://travis-ci.org/martindale/maki-queue)
[![Coverage Status](https://img.shields.io/coveralls/martindale/maki-queue.svg?style=flat-square)](https://coveralls.io/r/martindale/maki-queue)

A generic Worker Queue implementation, designed for [Maki][maki].

## Quick Start

Implementing Maki's Queue is easy:

1.  `npm install maki-queue`
2.  Queue jobs from your application:  
  ```javascript
  var Queue = require('maki-queue');
  var queue = new Queue('myAppName');
  
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
  var queue = new Queue('myAppName');

  // create the worker
  var worker = new queue.Worker('myAppName');

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

[maki]: http://github.com/martindale/maki
