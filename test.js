const logger = require('./index');



function doWork() {
  logger.warn('Oh no!', new Error('asfd'));
  logger.warn('text error', 'this is an error string')
}


function asdf() {
  doWork();
}

function aassddff() {
  logger.info('here');
}

asdf();
aassddff();
