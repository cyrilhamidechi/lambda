/*
Next: abstract CRUD layer and apigw interactions to put here only business aspects (refactoring will depend on other business cases)
*/

const async = require('async');
const getMysqlClient = require('mysql').createConnection;
const mysqlCfg = require('./mysql.cfg');
const apigw = require('./apigw-helper');
const eventMapping = require('./event-mapping');

apigw.init();

var mysqlClient;

exports.handler = (event, context, callback) => {

  eventMapping.map(event, context);

  console.log('Received event:', JSON.stringify(event, null, 2));
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

      if(eventMapping.isPost()) {
        write = "INSERT INTO Employee3 SET ?;"
        data = {Name: event.data.name, Details: JSON.stringify(event.data.details), empid: event.data.empid};
      }

      if(eventMapping.isPut()) {
        write = "UPDATE Employee3 SET ? WHERE empid = ? LIMIT 1;";
        data = [{Name: event.data.name, Details: JSON.stringify(event.data.details)}, event.data.empid];
      }

      if(eventMapping.isDelete()) {
        write = "DELETE FROM Employee3 WHERE empid = ? LIMIT 1;";
        data = [event.data.empid];
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

      if((!fields && !results) || (event && event.data && event.data.select)) {
        empid = (event && event.data && event.data.select) ? event.data.select.empid : null;
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
