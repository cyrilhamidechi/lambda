'use strict';

const wtf = require('async').waterfall;
const getMysqlClient = require('mysql').createConnection;
const mysqlCfg = require('./mysql.cfg');

const evt = require('../../commons/event-normalizer'); // Lambda's input
const apigw = require('../../commons/apigw-helper'); // Lambda's output

// should be a common dependency
var mysqlClient;
var dyndbClient;

function writeLog(log, noSNS)
{
  // should be a common dependancy
  console.log(log);
  // triggers SNS
}

function writeDetails(details, callback)
{
  console.log(details);
  const evtDetails = evt.getDetail("details");
  const evtId = evt.getDetail("id");
  const data = {Name: evtId, Details: JSON.stringify({bucket: evtDetails.bucket, s3: evtDetails.s3}), empid: Date.now()};
  // storing exif too

  const write = mysqlClient.query("INSERT INTO Employee3 SET ?;", data, (err, result, fields) => {
   console.log(err);
    writeLog("details written for uploaded picture " + evtId + " #" + result.insertId);
    // will trigger the SQS-Lambda ES
    callback(err);
  });
  console.log(write.sql);
/*  writeLog("details written for new picture uploaded");
  callback();*/
}

function reckognize(callback)
{
  // should be in an SQS-lambda
  writeLog("Rekog in progress on abc...");
  console.log("Rekog");
  writeLog("Rekog done for abc: ...");
  // should be written in RDS (will trigger the SQS-Lambda ES)
  callback();
}

function writeSearch(callback)
{
  // should be in another SQS-lambda too, triggerd by details written in RDS (initial+exif, rekog, ...)
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
  function (err)
  {
    if(mysqlClient) {
      mysqlClient.end();
    }
    if(dyndbClient) {
      dyndbClient.end();
    }
    callback(err, apigw.output());
  });

};
