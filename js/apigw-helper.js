module.exports = {
  "res": {
    "statusCode": 200,
    "headers": {
      "Content-Type": "*/*"
    },
    "data": {},
    "errors": []
  },
  output: function()
  {
    return this.res;
  },
  addError: function(error)
  {
    this.res.errors.push(error);
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
    if(container && !this.res.data[container]) {
      this.res.data[container] = {};
    }
    if(value) {
      if(container) {
        this.res.data[container][key] = value;
      } else {
        this.res.data[key] = value;
     }
    }
  }
}
