# AROL

Anal Retentive Opinionated Logger

Because I'm really high maintenance about my logging. Sorry I'm not sorry.

Creates an object and logs to console. Can be picked up by another service and processed.

Todo:
- add outputs other than the console
- make console logger easier to read

Current state: intended to be used in AWS lambda -> cloud watch logs

## Basic Usage
Install
```bash
npm -i arol
```

Use
```javascript
const logger = require('arol');
logger.info('Here is a message');

// add some details
const thingOfInterest = { name: 'Lucy', isXena: false };
logger.debug('debugging some object', null, thingOfInterest);

try {
  doSomethingBad();
} catch(err) {
  logger.warn('Unable to do something bad', err);
}
```

## API
#### logger.trace / debug / info / warn / error / fatal
Log something at the specified severity level
```javascript
logger.error(message, error, additionalDetails);
```
*message*: text to log

*error*: an error to log. This should be a node.js error object. If it is not an error, the logger will make it an error by calling `new Error(error)`. The error message, error type and stack trace will be logged in `error_info` key. If something falsy (null, undefined) is passed in, the `error_info` key is not added.

*additionalDetails*: any other info (typically an object) to save. This data is logged in the `details` key. If something falsy is passed in, the `details` key is not added.

#### logger.init
If there are additional fields to log with every log item, and these values are static, pass them in here. They will be added to every log.
```javascript
const staticValues = { application: 'my_app', server_ip: '1.2.3.5'};
logger.init(staticValues);
logger.debug('testing');
// {
//   "timestamp": "2018-01-01T00:00:00.000Z",
//   "severity": "debug`",
//   "msg": "testing",
//   "stack": { ... },
//   "application": "my_app",
//   "server_ip": "1.2.3.5"
// }
```
*staticValues*: an object to copy to every log.
