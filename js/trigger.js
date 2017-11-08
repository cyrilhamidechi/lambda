const h = require('./app').handler;

h({
//  "event":"somedetails",
/*  "httpVerb": "PUT",
  "data": {
    "empid": 123,
    "name": "Pierpoljacky",
    "details": {
      "field1": "value1",
      "nestobject": {
        "hip": {
          "pop": "heaps"
        }
      }
    },
    "select": {
      empid: 123
    }
  }*/
},{
  "my":"context"
},(err, res)=>{
    console.log("==== LAMBDA RESULTS ====");
    console.log(JSON.stringify(res, null, 2));
  }
);
