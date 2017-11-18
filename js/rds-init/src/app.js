'use strict';

const wtf = require('async').waterfall;
const getMysqlClient = require('mysql').createConnection;
const mysqlCfg = require('../../commons/mysql.cfg');

var mysqlClient;

exports.handler = (event, context, callback) => {
  wtf([
    function (callback)
    {
       if(mysqlCfg.database) {
         delete mysqlCfg.database;
       }
       mysqlClient = getMysqlClient(mysqlCfg);
       callback();
    },
    function (callback)
    {
      if(!mysqlClient) {
        callback("There's no MySql client");
        return;
      }
      mysqlClient.query("CREATE DATABASE mydb;", (results, fields, err) => {
        callback(err, {results: results, fields: fields});
      });
    }
  ],
  function (err, result)
  {
    if(mysqlClient) {
      mysqlClient.end();
    }
    callback(err, result);
  });

};
