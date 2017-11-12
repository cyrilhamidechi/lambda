const h = require('./src/app').handler;

const defaults = {
  event: "custom1",
  context: 0
};

const contexts = [
  {
    "my":"context",
    "noStringifyBody": true,
    "from": "custom"
  },
  {
    "another":"ctx"
  }
];

var event;
var eventFilename = defaults.event;
try {
  if(process.argv.length>2) {
    eventFilename = process.argv[2];
  }
  event = require('./samples/' + eventFilename  + '.json');
} catch (e) {
  console.log(e);
}

var context = contexts[0];
if(process.argv.length>3 && contexts[parseInt(process.argv[3])]) {
  context = contexts[parseInt(process.argv[3])];
}

h(event, context, (err, res)=>{
    console.log("--- LAMBDA RESULTS");
    console.log(JSON.stringify(res, null, 2));
  }
);
