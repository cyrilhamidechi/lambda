module.exports = {
  map: function(event, context)
  {
    this.original = event;
    this.context = context;
    this.event = {
      event: "GET"
    };
    if("custom" == this.context.from) {
      this.mapCustom();
    }
    if(this.original.Records) {
      this.mapS3();
    }
  },
  mapCustom: function()
  {
    this.event.method = this.original.httpVerb.toUpperCase();
  },
  mapS3: function()
  {
    this.event.method = this.original.httpMethod.toUpperCase();
  },
  mapGw: function()
  {
    // some mapping for event coming from API Gateway
  },
  isGet: function()
  {
    return "GET" == this.event.method;
  },
  isPost: function()
  {
    return "POST" == this.event.method;
  },
  isPut: function()
  {
    return "PUT" == this.event.method;
  },
  isDelete: function()
  {
    return "DELETE" == this.event.method;
  }
}
