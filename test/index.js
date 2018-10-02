const chai = require('chai');
const path = require('path');
const logClass = require('../src/class');
const helper = require('./helper');

describe('Basic methods', function() {
  const logger = new logClass({ outputs: [] });
  it('Has a log method', function() {
    chai.expect(logger).to.have.property('log');
    chai.expect(() => logger.log('test', 'message')).not.to.throw();
  });
  it('Logging returns an object', function() {
    const log = logger.debug('test');
    chai.expect(log).to.be.an('object');
  });
  it('Has a trace method', function() {
    chai.expect(logger).to.have.property('trace');
    chai.expect(() => logger.trace('test')).not.to.throw();
  });
  it('Has a debug method', function() {
    chai.expect(logger).to.have.property('debug');
    chai.expect(() => logger.debug('test')).not.to.throw();
  });
  it('Has a info method', function() {
    chai.expect(logger).to.have.property('info');
    chai.expect(() => logger.info('test')).not.to.throw();
  });
  it('Has a warn method', function() {
    chai.expect(logger).to.have.property('warn');
    chai.expect(() => logger.warn('test')).not.to.throw();
  });
  it('Has a error method', function() {
    chai.expect(logger).to.have.property('error');
    chai.expect(() => logger.error('test')).not.to.throw();
  });
  it('Has a fatal method', function() {
    chai.expect(logger).to.have.property('fatal');
    chai.expect(() => logger.fatal('test')).not.to.throw();
  });
});


describe('Constructor "every" options', function() {
  let x = 0;
  const every = {
    str: 'a string',
    num: 23,
    func: function() { return x; }
  }
  const logger = new logClass({ every, outputs: [] });

  describe('Static values', function() {
    const log = logger.debug('msg');
    it('Adds strings', function() {
      chai.expect(log.str).to.equal('a string');
    });
    it('Adds numbers', function() {
      chai.expect(log.num).to.equal(23);
    });
  });

  describe('functions', function() {
    it('Calls functions and applies their return value', function() {
      chai.expect(logger.debug('msg').func).to.equal(0);
    });
    it('Calls functions every time it creates a log', function() {
      x = 27;
      chai.expect(logger.debug('msg').func).to.equal(27);
    });
  });
});

describe('Logger provided field options', function() {
  const falsy = new logClass({
    timestamp: false,
    severity: 0,
    message: null,
    stack: undefined,
    outputs: []
  });
  const defaultVals = new logClass({ outputs: [] });
  const overrides = new logClass({
    timestamp: 'the_ts',
    severity: 123,
    message: 'some thing',
    stack: 'yeah',
    outputs: [],
  });

  describe('"timestamp" field', function() {
    it('Returns "timestamp" field when parameter is ommitted', function() {
      chai.expect(defaultVals.warn('blah')).to.have.property('timestamp');
    });
    it('Does not return timestamp when constructed with falsy value', function() {
      chai.expect(falsy.warn('blah')).not.to.have.property('timestamp');
    });
    it('Returns name when provided a value', function() {
      chai.expect(overrides.warn('blah')).not.to.have.property('timestamp');
      chai.expect(overrides.warn('blah')).to.have.property('the_ts');
    });
  });

  describe('"severity" field', function() {
    it('Returns "severity" field when parameter is ommitted', function() {
      chai.expect(defaultVals.warn('blah')).to.have.property('severity');
    });
    it('Does not return severity when constructed with falsy value', function() {
      chai.expect(falsy.warn('blah')).not.to.have.property('severity');
    });
    it('Returns name when provided a value', function() {
      chai.expect(overrides.warn('blah')).not.to.have.property('severity');
      chai.expect(overrides.warn('blah')).to.have.property(123);
    });
  });

  describe('"message" field', function() {
    it('Returns "msg" field when parameter is ommitted', function() {
      chai.expect(defaultVals.warn('blah')).to.have.property('msg');
    });
    it('Does not return message when constructed with falsy value', function() {
      chai.expect(falsy.warn('blah')).not.to.have.property('message');
    });
    it('Returns name when provided a value', function() {
      chai.expect(overrides.warn('blah')).not.to.have.property('msg');
      chai.expect(overrides.warn('blah')).to.have.property('some thing');
    });
  });

  describe('"stack" field', function() {
    it('Returns "stack" field when parameter is ommitted', function() {
      chai.expect(defaultVals.warn('blah')).to.have.property('stack');
    });
    it('Does not return stack when constructed with falsy value', function() {
      chai.expect(falsy.warn('blah')).not.to.have.property('stack');
    });
    it('Returns name when provided a value', function() {
      chai.expect(overrides.warn('blah')).not.to.have.property('stack');
      chai.expect(overrides.warn('blah')).to.have.property('yeah');
    });
    describe('Stack output', function() {
      const logStack = helper.stackTestFunc(defaultVals, 'debug', 'some msg').stack;
      xit('Stack.file is correct', function() {
        const helperfile = path.resolve('./helper.js')
        chai.expect(logStack.file).to.equal(helperfile);
      });
      it('Stack.line is correct', function() {
        chai.expect(logStack.line).to.equal(2);
      });
      it('Stack.function is correct', function() {
        chai.expect(logStack.function).to.equal('stackTestFunc');
      });
    });
  });
});
