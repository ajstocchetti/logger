const logger = require('./src/index');



function doWork() {
  logger.warn('Oh no!', new Error('asfd'));
  logger.warn('text error', 'this is an error string')
}


function asdf() {
  doWork();
}

function aassddff() {
  logger.info('here', 'help!', { a:1, b:2});
}

asdf();
aassddff();
logger.debug('testing')
