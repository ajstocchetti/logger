# AROL

Anal Retentive Opinionated Logger. Now less opinionated.

Because I'm really high maintenance about my logging. Sorry I'm not sorry.

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
```

Do something with every log
```javascript
const prettyPrint = obj => console.log(JSON.stringify(obj, null, 2));
const sendToLogStore = data => { /* */ };
const logger = new Arol({ outputs: [prettyPrint, sendToLogStore] });
logger.info('This will be printed and saved to store');

// pass in errors and get stack trace
try {
  doSomethingBad();
} catch(err) {
  logger.warn('Unable to do something bad', err);
}

// add some details
const thingOfInterest = { name: 'Lucy', isXena: false };
logger.debug('debugging some object', null, thingOfInterest);

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

*timestamp*: the key to save the timestamp to. If falsely value is provided, timestamp is not saved. Default is `timestamp`.

*severity*: the key to save the log severity to. If falsely value is provided, severity is not saved. Default is `severity`.

*message*: the key to save the timestamp to. If falsely value is provided, the message is not saved (not sure why you would want to do that...). Default is `msg`.

*stack*: the key to save the stack trace to. If falsely value is provided, the stack trace is not saved. Default is `stack`.

*outputs*: an array of functions to pass the output to (for logging to console, sending to log aggregator, etc). Default is no actions.


#### logger.trace / debug / info / warn / error / fatal
Log something at the specified severity level
```javascript
logger.error(message, error, additionalDetails);
```
*message*: text to log

*error*: an error to log. This should be a node.js error object. If it is not an error, the logger will make it an error by calling `new Error(error)`. The error message, error type and stack trace will be logged in `error_info` key. If something falsy (null, undefined) is passed in, the `error_info` key is not added.

*additionalDetails*: any other info (typically an object) to save. This data is logged in the `details` key. If something falsy is passed in, the `details` key is not added.
