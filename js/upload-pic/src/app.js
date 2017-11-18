'use strict';

const wtf = require('async').waterfall;
const getMysqlClient = require('mysql').createConnection;
const mysqlCfg = require('./mysql.cfg');

const evt = require('../../commons/event-normalizer'); // Lambda's input
const apigw = require('../../commons/apigw-helper'); // Lambda's output

var mysqlClient;
var dyndbClient;

function writeLog(log, noSNS)
{
  console.log(log);
  // triggers SNS
}

function writeDetails(details, callback)
{
  console.log(details);
/*  mysqlClient.query("INSERT details INTO ...;", (results, fields, err) => {
    callback(err, {results: results, fields: fields});
  });*/
  writeLog("details written for new picture uploaded");
  callback();
}

function reckognize(callback)
{
  writeLog("Rekog in progress on abc...");
  console.log("Rekog");
  writeLog("Rekog done for abc: ...");
  callback();
}

function writeSearch(callback)
{
  console.log("ES");
  writeLog("picture details and rekog availables for search");
  callback();
}

function resize(callback)
{
  console.log("S3 resized");
  writeLog("picture resized");
  callback();
}

exports.handler = (event, context, callback) => {

  apigw.init(context);
  evt.normalize(event);

  wtf([
    function (callback)
    {
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
    writeDetails,
    reckognize,
    writeSearch,
    resize
  ],
  function (err, result)
  {
    if(mysqlClient) {
      mysqlClient.end();
    }
    if(dyndbClient) {
      dyndbClient.end();
    }
    callback(err, result);
  });

};
