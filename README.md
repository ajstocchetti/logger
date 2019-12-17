# AROL

Anal Retentive Opinionated Logger. Because I'm really high maintenance about my logging.

Now with 40% fewer opinions.

## Basic Usage
Install
```bash
npm -i arol
```

Use
```javascript
// basic use
const Arol = require('arol');
const logger = new Arol();
logger.info('Here is a message');
```

This is not very helpful, as nothing is saved by default. The logger returns an object with the log message and metadata
```javascript
// do something with the log
const log = logger.info('Something just happened');
console.log(JSON.stringify(log));
// {
//   "timestamp": "2018-01-02T03:45:53.589Z",
//   "severity": "info",
//   "msg": "Something just happened",
//   "stack": {
//     "file": "/home/dev/arol/readme.js",
//     "line": 1,
//     "function": null
//   }
// }
```

Do something with every log
```javascript
const prettyPrint = obj => console.log(JSON.stringify(obj, null, 2));
const sendToLogStore = data => { /* */ };
const logger = new Arol({ outputs: [prettyPrint, sendToLogStore] });
logger.info('This will be printed and saved to store');

// only print some of the fields, on a single line
const printLine = data => console.log(data.timestamp, '--', data.severity, '--', data.msg);
const logger = new Arol({ outputs: [printLine] });
logger.info('This will be printed on one line');
// 2018-01-02T03:45:53.589Z--info--This will be printed on one line
```
Pass in errors and get stack trace
```javascript
try {
  throw new TypeError('Bad type!');
} catch(err) {
  logger.warn('Unable to do something bad', err);
}
// {
//   "timestamp": "2018-01-02T03:45:53.589Z",
//   "severity": "warn",
//   "msg": "Unable to do something bad",
//   "stack": {
//     "file": "/home/dev/arol/readme.js",
//     "line": 7,
//     "function": null
//   },
//   "error_info": {
//     "message": "Bad type!",
//     "name": "TypeError",
//     "line": "5",
//     "stack": "TypeError: Bad type!\n    at Object.<anonymous> (/home/dev/arol/readme.js:10:13)"
//   }
// }
```
Add some details
```javascript
const thingOfInterest = { name: 'Lucy Lawless', isXena: false };
logger.debug('debugging some object', null, thingOfInterest);
// {
//   "timestamp": "2018-01-02T03:45:53.589Z",
//   "severity": "debug",
//   "msg": "debugging some object",
//   "stack": {
//     "file": "/home/dev/arol/readme.js",
//     "line": 9,
//     "function": null
//   },
//   "details": {
//     "name": "Lucy Lawless",
//     "isXena": false
//   }
// }
```

## API
#### constructor
```javascript
const logger = new Arol({
  every: {},
  timestamp: 'timestamp',
  severity: 'severity',
  message: 'msg',
  stack: 'stack',
  outputs: [ console.log ],
});
```
*every*: An object to copy to every log. Default is empty object (`{}`)

*timestamp*: the key to save the timestamp to. If falsely value is provided, timestamp is not saved. Default is `timestamp` if non specified or non-string value specified.

*ts_function*: the function to generate the timestamp. If no function is provided, default is the current date in simplified extended ISO format, ISO 8601. `new Date().toISOString()`

*severity*: the key to save the log severity to. If falsely value is provided, severity is not saved. Default is `severity` if non specified or non-string value specified.

*message*: the key to save the timestamp to. If falsely value is provided, the message is not saved (not sure why you would want to do that...). Default is `msg` if non specified or non-string value specified.

*stack*: the key to save the stack trace to. If falsely value is provided, the stack trace is not saved. Default is `stack` if non specified or non-string value specified.

*outputs*: an array of functions to pass the output to (for logging to console, sending to log aggregator, etc). Default is no actions.


#### logger.trace / debug / info / warn / error / fatal
Log something at the specified severity level
```javascript
logger.error(message, error, additionalDetails);
```
*message*: text to log

*error*: an error to log. This should be a node.js error object. If it is not an error, the logger will make it an error by calling `new Error(error)`. The error message, error type and stack trace will be logged in `error_info` key. If something falsy (null, undefined) is passed in, the `error_info` key is not added.

*additionalDetails*: an object of additional details to save. This data is logged in the `details` key. If something a non-object is provided in, the `details` key is not added. Will override any `details` info set in the `every` field of the logger constructor.
