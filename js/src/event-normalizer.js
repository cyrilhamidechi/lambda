module.exports = {


  normalize: function(event)
  {
    this.raw = event;
    this.actionsMap = {};
    this.firstRecord = (this.raw.Records && this.raw.Record.length > 0) ? this.raw.Record[0] : {};
    this.event = {};

    var normalized = false;

    // AWS events

    if(this.raw.source && "aws.events"==this.raw.source) {
      normalized = this.normalizeScheduled();
    }
    if(this.raw.awslogs) {
      normalized = this.normalizeLogs();
    }
    if(this.firstRecord.EventSource && "aws:sns"==this.firstRecord.EventSource) {
      normalized = this.normalizeSNS();
    }
    if(this.firstRecord.eventSource && "aws:dynamodb"==this.firstRecord.eventSource) {
      normalized = this.normalizeDynamoDB();
    }
    if(this.raw.eventType && "SyncTrigger"==this.raw.eventType) {
      normalized = this.normalizeCognitoSync();
    }
    if(this.firstRecord.eventSource && "aws:s3"==this.firstRecord.eventSource) {
      normalized = this.normalizeS3();
    }
    if(this.raw.httpMethod && this.raw.path && this.raw.requestContext) {
      normalized = this.normalizeGwRquest();
    }
    if(this.raw.statusCode && this.raw.headers && this.raw.body) {
      normalized = this.normalizeGwResponse();
    }


    //custom events

    if(!normalized) {
      normalized = this.normalizeCustom();
    }


    if(this.actionsMap[this.event.action]) {
      this.event.action = this.actionsMap[this.event.action];
    }

    return normalized;

  },


  normalizeScheduled: function()
  {
    this.event.type = "scheduled";
    return true;
  },
  normalizeLogs: function()
  {
    this.event.type = "logs";
    return true;
  },
  normalizeSNS: function()
  {
    this.event.type = "sns";
    return true;
  },
  normalizeDynamoDB: function()
  {
    this.event.type = "dynamodb";
    return true;
  },
  normalizeCognitoSync: function()
  {
    this.event.type = "cogsync";
    return true;
  },
  normalizeS3: function()
  {
    this.event.type = "s3";
    this.event.action = this.firstRecord.eventName;
    this.actionsMap = {
      "ObjectCreated:Put": "update",
      "ObjectRemoved:Delete": "delete"
    };
    return true;
  },
  normalizeGwRequest: function()
  {
    this.event.type = "gwreq"
    this.event.action = this.raw.httpMethod.toUpperCase();
    this.actionsMap = this.getHttpMapping();
    return true;
  },
  normalizeGwResponse: function()
  {
    this.event.type = "gwresp";
    return true;
  },


  normalizeCustom: function()
  {
    if(!this.raw.type) {
      this.event.type = "custom";
      this.event.action = this.raw.httpVerb.toUpperCase();
      this.actionsMap = this.getHttpMapping();
      return true;
    }

    this.event.type = this.raw.type;
    switch(this.event.type) {
// add customs normalizers
//      case "john":
//        return this.normalizeJohn();
//        break;
//
    }

    return false;
  },


  is: function(type)
  {
    return type == this.event.type;
  },
  isAction: function(action)
  {
    return action == this.event.action;
  },
  isCreate: function()
  {
    return this.isAction("create");
  },
  isRead: function()
  {
    return this.isAction("read");
  },
  isUpdate: function()
  {
    return this.isAction("update");
  },
  isDelete: function()
  {
    return this.isAction("delete");
  },
  getType: function(){
    return this.event.type;
  },
  getAction: function(){
    return this.event.action;
  },
  getRaw: function(){
    return this.raw;
  }
  getHttpMapping: function()
  {
    return {
      "POST": "create",
      "GET": "read",
      "PUT": "update",
      "PATCH": "update",
      "DELETE": "delete"
    };
  }


}
