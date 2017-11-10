const async = require('async');
const getMysqlClient = require('mysql').createConnection;
const mysqlCfg = require('./mysql.cfg');

const evt = require('./event-normalizer'); // Lambda's input
const apigw = require('./apigw-helper'); // Lambda's output


apigw.init();
var mysqlClient;


exports.handler = (event, context, callback) => {

  evt.normalize(event);

  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('Normalized event': JSON.stringify(event, null, 2));
  console.log('Received contex:', JSON.stringify(context, null, 2));

  if(context && context.noStringifyBody) {
    apigw.stringifyBody  = false;
  }

  async.waterfall([
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

      if(!event || !event.data) {
        callback(null, null, null); //errors, results, fields
        return;
      }

      var write, data;

      //only triggered by a S3 put event
      if(evt.is("s3") && evt.isCreate()) {
        write = "INSERT INTO Employee3 SET ?;"
        data = {Name: event.data.name, Details: JSON.stringify(event.data.details), empid: event.data.empid};
      }

      //only triggered by an API Gateway put event
      if(evt.is("gwreq") && evt.isUpdate()) {
        write = "UPDATE Employee3 SET ? WHERE empid = ? LIMIT 1;";
        data = [{Name: event.data.name, Details: JSON.stringify(event.data.details)}, event.data.empid];
      }

      //triggered either by a S3 delete event, either by an API Gateway delete event
      if(evt.isDelete() && (evt.is("s3") || evt.is("gwreq"))) {
        write = "DELETE FROM Employee3 WHERE empid = ? LIMIT 1;";
        data = [event.data.empid];
        // if this action is from gw, a S3 delete action must be triggered
      }

      if(write) {
        var w = mysqlClient.query(write, data, callback);
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
//      if((!fields && !results) || (event && event.data && event.data.select)) {
     if((evt.is("gwreq") || evt.is("custom")) && (evt.isRead() || (event.data && event.data.select))) {
        empid = (event.data && event.data.select) ? event.data.select.empid : null;
        var s = mysqlClient.query("SELECT * FROM Employee3" + (empid ? " WHERE empid = ? LIMIT 1" : "") + ";", [empid], callback);
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
