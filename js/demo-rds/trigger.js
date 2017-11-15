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
var eventFilepath;
try {
  if(process.argv.length>2) {
    eventFilename = process.argv[2];
  }
  var folder = "samples";
  if("p-" == eventFilename.substr(0,2)) {
    folder = "private";
    eventFilename = eventFilename.substr(2);
  }
  eventFilepath = './' + folder  + '/' + eventFilename  + '.json';
  event = require(eventFilepath);
} catch (e) {
  console.log(e);
}

var context = contexts[0];
if(process.argv.length>3 && contexts[parseInt(process.argv[3])]) {
  context = contexts[parseInt(process.argv[3])];
}

h(event, context, (err, res)=>{
    console.log("file loaded: " + eventFilepath);
    console.log("--- LAMBDA RESULTS");
    console.log(JSON.stringify(res, null, 2));
  }
);
