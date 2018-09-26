# Simple Logger

Intended to expedite logging in applications

Todo: turn into node module

## Basic Usage
```javascript
const logger = require('./src');
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
#### trace / debug / info / warn / error / fatal(message, error, additionalInfo)
message: text to log
error: error object to log
additionalInfo: any other info (typically an object)

#### init(values)
a static object to log along with all logging calls
```javascript
logger.init({ application: 'my_app', server_ip: '1.2.3.5'});
logger.debug('testing');
// prints
// {
//   "timestamp": "2018-01-01T00:00:00.000Z",
//   "severity": "debug`",
//   "msg": "testing",
//   "stack": { ... },
//   "application": "my_app",
//   "server_ip": "1.2.3.5"
// }
```
