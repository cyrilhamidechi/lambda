module.exports = {
  init: function(context)
  {
    this.stringifyBody = !(context && context.noStringifyBody);
    this.res = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        "data": {},
        "errors": []
      }
    };
  },
  output: function()
  {
    try {
      if(this.stringifyBody) {
        this.res.body = JSON.stringify(this.res.body);
      }
      return this.res;
    } catch(e) {
      return {
        statusCode: 500,
        body: e.stack.toString()
      };
    }
  },
  addError: function(error)
  {
    this.res.body.errors.push(error);
    this.setStatusCode(400);
  },
  setStatusCode: function(code)
  {
    this.res.statusCode = code;
  },
  setHeader: function(key, value)
  {
    this.res.headers[key] = value;
  },
  add: function(key, value, container)
  {
    this.addData(key, value, container);
  },
  addData: function(key, value, container)
  {
    if(container && !this.res.body.data[container]) {
      this.res.body.data[container] = {};
    }
    if(value) {
      if(container) {
        this.res.body.data[container][key] = value;
      } else {
        this.res.body.data[key] = value;
     }
    }
  }
}
