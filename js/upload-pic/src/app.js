'use strict';

exports.handler = (event, context, callback) => {
  console.log(event);
  callback(null, "Upload pic: prepare/resize, aurora, rekog, elasticsearch, dynamodb, sns");
};
