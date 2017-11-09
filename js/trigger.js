const h = require('./src/app').handler;

const events = {
  gwget: {},
  gwput: {
    "resource": "my/resource/path",
    "path": "my/path/?with=param",
    "httpMethod": "PUT",
    "headers": {"x-some-custom-header":"amazing"}, //Incoming request headers
    "queryStringParameters": {"hip":"hop"}, //query string parameters
    "pathParameters":  {"mypath":"param"}, // path parameters
    "stageVariables": {"where":"ami"}, // Applicable stage variables
    "requestContext": {"some":"context"}, // Request context, including authorizer-returned key-value pairs
    "isBase64Encoded": false,
    "body": "{\"empid\":123,\"name\":\"Pierpoljacky\",\"details\":{\"field1\":\"value1\",\"nestobject\":{\"hip\":{\"pop\":\"heaps\"}}},\"select\":{\"empid\":123}}"
  },
  s3put: {},
  s3del: {},
  default: {
//    "event":"somedetails",
    "httpVerb": "PUT",
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
    }
  }
};

var contexts = [
  {
    "my":"context",
    "noStringifyBody": true
  },
  {
    "another":"ctx"
  }
];


var event = events.default;
if(process.argv.length>2 && events[process.argv[2]]) {
  event = events[process.argv[2]];
}

var context = contexts[0];
if(process.argv.length>3 && contexts[parseInt(process.argv[3])]) {
  context = contexts[parseInt(process.argv[3])];
}

h(event, context, (err, res)=>{
    console.log("==== LAMBDA RESULTS ====");
    console.log(JSON.stringify(res, null, 2));
  }
);
