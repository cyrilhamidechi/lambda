'use strict';

const h = require('./src/app').handler;

const event = {};
const context = {};

h(event, context, (err, res)=>{
    console.log(JSON.stringify(res, null, 2));
    console.log(JSON.stringify(err, null, 2));
  }
);
