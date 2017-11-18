'use strict';

const wtf = require('async').waterfall;
const getMysqlClient = require('mysql').createConnection;
// incoming other recurrent libs: dynamodb, ES, S3

const mysqlCfg = require('../../commons/mysql.cfg');
const evt = require('../../commons/event-normalizer'); // Lambda's input
const apigw = require('../../commons/apigw-helper'); // Lambda's output

var mysqlClient;

function anotherFn(details, callback)
{
  console.log("Here's another function with: " + details);
  callback();
}

exports.handler = (event, context, callback) => {

  apigw.init(context);
  evt.normalize(event);

  wtf([
    function (callback)
    {
       console.log("Connecting to database " + mysqlCfg.database + "...");
       mysqlClient = getMysqlClient(mysqlCfg);
       callback();
    },
    function (callback)
    {
      if(!mysqlClient) {
        callback("There's no MySql client");
        return;
      }
      callback(null, {"some":"details"});
    },
    anotherFn,
  ],
  function (err)
  {
    if(mysqlClient) {
      mysqlClient.end();
    }
    callback(err, apigw.output());
  });

};
