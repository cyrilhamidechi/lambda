'use strict';

const wtf = require('async').waterfall;
const getMysqlClient = require('mysql').createConnection;
const mysqlCfg = require('./mysql.cfg');

const evt = require('./event-normalizer'); // Lambda's input
const apigw = require('./apigw-helper'); // Lambda's output


var mysqlClient;


exports.handler = (event, context, callback) => {

  apigw.init();

  if(!event) {
    callback("Event is missing");
    return;
  }

  evt.normalize(event);
  if(evt.is("gwreq")) {
    if(event.pathParameters && event.pathParameters.empid) {
      evt.setDetail("empid", event.pathParameters.empid);
    }
  } else if(evt.is("s3")) {
      evt.setDetail("empid", evt.getDetail("id"));
  } else if(evt.is("custom") && event.data) {
    // "custom" specific process here if needed
  }

//  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('Normalized event:', JSON.stringify(evt.event, null, 2));
//  console.log('Received contex:', JSON.stringify(context, null, 2));

  if(context && context.noStringifyBody) {
    apigw.stringifyBody  = false;
  }

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

      var write, data;

      //only triggered by a S3 put event
      if(evt.is("s3") && evt.isUpdate()) {
        write = "INSERT INTO Employee3 SET ?;"
        const details = evt.getDetail("details");
        data = {Name: evt.getDetail("id"), Details: JSON.stringify({bucket: details.bucket, s3: details.s3}), empid: evt.getDetail("id")};
      }

      //only triggered by an API Gateway put event
      if((evt.is("gwreq") || evt.is("custom")) && evt.isUpdate()) {
        write = "UPDATE Employee3 SET ? WHERE empid = ? LIMIT 1;";
        data = [{Name: evt.getDetail("name"), Details: JSON.stringify(evt.getDetail("details"))}, evt.getDetail("empid")+""];
      }

      //triggered either by a S3 delete event, either by an API Gateway delete event
      if(evt.isDelete() && (evt.is("s3") || evt.is("gwreq"))) {
        write = "DELETE FROM Employee3 WHERE empid = ? LIMIT 1;";
        data = [evt.getDetail("empid")+""];
        // if this action is from gw, a S3 delete action must be triggered
      }

      if(write) {
        const w = mysqlClient.query(write, data, callback);
        apigw.add("query", w.sql, "write");
        return;
      }

      callback(null, null, null); //errors, results, fields
    },
    function (results, fields, callback)
    {
      apigw.add("results", results, "write");
      apigw.add("fields", fields, "write");

      //Can be triggered:
      // - by an API Gateway GET event (to all items or to a portion only)
      // - by any of the previous API Gateway writes if there's an explicit "select" flag within the event
     const select = evt.getDetail("select");
     if((evt.is("gwreq") || evt.is("custom")) && (evt.isRead() || select)) {
        const empid = select ? (select.empid + "") : null;
        const s = mysqlClient.query("SELECT * FROM Employee3" + (empid ? " WHERE empid = ? LIMIT 1" : "") + ";", [empid], callback);
        apigw.add("query", s.sql, "select");
        return;
     }
      callback(null, null, null); //errors, results, fields
    },
    function (results, fields, callback)
    {
      apigw.add("results", results, "select");
      apigw.add("fields", fields, "select");
      callback();
    }
  ],
  function (err)
  {
    if (err) {
      apigw.addError(err);
    }
    if(mysqlClient) {
      mysqlClient.end();
    }
    callback(err, apigw.output());
  })
};
