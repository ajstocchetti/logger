// const logger = require('./src/index');
const logger = new (require('./src/class'))();

logger.info('i thought you would like to know', null, { foo: 'bar' });
logger.error('An error occured', new Error('Demoing an error'));

function someBusinessLogic() {
  logger.debug('doing buisiness logic');
}
someBusinessLogic();
