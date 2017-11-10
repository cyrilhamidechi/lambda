const h = require('./src/app').handler;

const events = {
//API Gateway events
  gwget: {
    "resource": "my/resource/path",
    "path": "my/path/?with=param",
    "httpMethod": "GET",
    "headers": {"x-some-custom-header":"amazing"}, //Incoming request headers
    "queryStringParameters": {"hip":"hop"}, //query string parameters
    "pathParameters":  {"mypath":"param"}, // path parameters
    "stageVariables": {"where":"ami"}, // Applicable stage variables
    "requestContext": {"some":"context"}, // Request context, including authorizer-returned key-value pairs
    "isBase64Encoded": false,
    "body": "{\"empid\":123}"
  },
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
  gwdel: {
    "resource": "my/resource/path",
    "path": "my/path/?with=param",
    "httpMethod": "DELETE",
    "headers": {"x-some-custom-header":"amazing"}, //Incoming request headers
    "queryStringParameters": {"hip":"hop"}, //query string parameters
    "pathParameters":  {"mypath":"param"}, // path parameters
    "stageVariables": {"where":"ami"}, // Applicable stage variables
    "requestContext": {"some":"context"}, // Request context, including authorizer-returned key-value pairs
    "isBase64Encoded": false,
    "body": "{\"empid\":456},\"select\":true}"
  },
//S3 events
  s3put: {
    "Records":[  
      {
        "eventVersion":"2.0",
        "eventSource":"aws:s3",
        "awsRegion":"us-east-1",
        "eventTime":"1970-01-01T00:00:00.000Z",
        "eventName":"ObjectCreated:Put",
        "userIdentity":{  
          "principalId":"AIDAJDPLRKLG7UEXAMPLE"
        },
        "requestParameters":{  
          "sourceIPAddress":"127.0.0.1"
        },
        "responseElements":{  
          "x-amz-request-id":"C3D13FE58DE4C810",
          "x-amz-id-2":"FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
        },
        "s3":{  
          "s3SchemaVersion":"1.0",
          "configurationId":"testConfigRule",
          "bucket":{  
            "name":"mybucket",
            "ownerIdentity":{  
              "principalId":"A3NL1KOZZKExample"
             },
            "arn":"arn:aws:s3:::mybucket"
          },
          "object":{  
            "key":"HappyFace.jpg",
            "size":1024,
            "eTag":"d41d8cd98f00b204e9800998ecf8427e",
            "versionId":"096fKKXTRTtl3on89fVO.nfljtsv6qko",
            "sequencer":"0055AED6DCD90281E5"
          }
        }
      }
    ]
  },
  s3del: {
    "Records":[
      {
        "eventVersion": "2.0",
        "eventTime": "1970-01-01T00:00:00.000Z",
        "requestParameters": {
          "sourceIPAddress": "127.0.0.1"
        },
        "s3": {
          "configurationId": "testConfigRule",
          "object": {
            "sequencer": "0A1B2C3D4E5F678901",
            "key": "HappyFace.jpg"
          },
          "bucket": {
            "arn": bucketarn,
            "name": "sourcebucket",
            "ownerIdentity": {
              "principalId": "EXAMPLE"
            }
          },
          "s3SchemaVersion": "1.0"
        },
        "responseElements": {
          "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH",
          "x-amz-request-id": "EXAMPLE123456789"
        },
        "awsRegion": "us-east-1",
        "eventName": "ObjectRemoved:Delete",
        "userIdentity": {
          "principalId": "EXAMPLE"
        },
        "eventSource": "aws:s3"
      }
    ]
  },
//Cognito Sync event
  cogsync: {
    "version": 2,
    "eventType": "SyncTrigger",
    "region": "us-east-1",
    "identityPoolId": "identityPoolId",
    "identityId": "identityId",
    "datasetName": "datasetName",
    "datasetRecords": {
      "SampleKey1": {
        "oldValue": "oldValue1",
        "newValue": "newValue1",
        "op": "replace"
      },
      "SampleKey2": {
        "oldValue": "oldValue2",
        "newValue": "newValue2",
        "op": "replace"
      },..
    }
  },
//SNS event
  sns: {
    "Records": [
      {
        "EventVersion": "1.0",
        "EventSubscriptionArn": eventsubscriptionarn,
        "EventSource": "aws:sns",
        "Sns": {
          "SignatureVersion": "1",
          "Timestamp": "1970-01-01T00:00:00.000Z",
          "Signature": "EXAMPLE",
          "SigningCertUrl": "EXAMPLE",
          "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
          "Message": "Hello from SNS!",
          "MessageAttributes": {
            "Test": {
              "Type": "String",
              "Value": "TestString"
            },
            "TestBinary": {
              "Type": "Binary",
              "Value": "TestBinary"
            }
          },
          "Type": "Notification",
          "UnsubscribeUrl": "EXAMPLE",
          "TopicArn": topicarn,
          "Subject": "TestInvoke"
        }
      }
    ]
  },
//CodeCommit event
  code: {},
//CloudWatchLog scheduled event
  scheduled: {
    "account": "123456789012",
    "region": "us-east-1",
    "detail": {},
    "detail-type": "Scheduled Event",
    "source": "aws.events",
    "time": "1970-01-01T00:00:00Z",
    "id": "cdc73f9d-aea9-11e3-9d5a-835b769c0d9c",
    "resources": [
      "arn:aws:events:us-east-1:123456789012:rule/my-schedule"
    ]
  },
//Default event
  custom1: {
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
    "noStringifyBody": true,
    "from": "custom"
  },
  {
    "another":"ctx"
  }
];


var event = events.custom1;
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
