'use strict';

const h = require('./src/app').handler;

const event = {
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
};
const context = {};

h(event, context, (err, res)=>{
    console.log(JSON.stringify(res, null, 2));
    console.log(JSON.stringify(err, null, 2));
  }
);
