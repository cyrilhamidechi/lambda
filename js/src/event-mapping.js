module.exports = {
  map: function(event, context)
  {
    this.original = event;
    this.context = context;
    if("custom" == this.context.from) {
      this.mapCustom();
    }
    if(this.original.Records) {
      this.mapS3();
    }
  },
  mapCustom: function()
  {
    this.event.httpMethod = this.original.httpVerb.toUpperCase();
  },
  mapS3: function()
  {
    this.event.httpMethod = this.original.httpMethod.toUpperCase();
  },
  mapGw: function()
  {
    // some mapping for event coming from API Gateway
  },
  isGet: function()
  {
    return "GET" == this.event.httpMethod;
  },
  isPost: function()
  {
    return "POST" == this.event.httpMethod;
  },
  isPut: function()
  {
    return "PUT" == this.event.httpMethod;
  },
  isDelete: function()
  {
    return "DELETE" == this.event.httpMethod;
  }
}
