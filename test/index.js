const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const path = require('path');
const logClass = require('../src');
const helper = require('./helper');

const expect = chai.expect;
const logger = new logClass();

describe('Basic methods', function() {
  it('Has a log method', function() {
    expect(logger).to.have.property('log');
    expect(() => logger.log('test', 'message')).not.to.throw();
  });
  it('Logging returns an object', function() {
    const log = logger.debug('test');
    expect(log).to.be.an('object');
  });
  it('Has a trace method', function() {
    expect(logger).to.have.property('trace');
    expect(() => logger.trace('test')).not.to.throw();
  });
  it('Has a debug method', function() {
    expect(logger).to.have.property('debug');
    expect(() => logger.debug('test')).not.to.throw();
  });
  it('Has a info method', function() {
    expect(logger).to.have.property('info');
    expect(() => logger.info('test')).not.to.throw();
  });
  it('Has a warn method', function() {
    expect(logger).to.have.property('warn');
    expect(() => logger.warn('test')).not.to.throw();
  });
  it('Has a error method', function() {
    expect(logger).to.have.property('error');
    expect(() => logger.error('test')).not.to.throw();
  });
  it('Has a fatal method', function() {
    expect(logger).to.have.property('fatal');
    expect(() => logger.fatal('test')).not.to.throw();
  });
});


describe('Constructor "every" options', function() {
  let x = 0;
  const every = {
    str: 'a string',
    num: 23,
    func: function() { return x; }
  }
  const everyLogger = new logClass({ every });

  describe('Static values', function() {
    const log = everyLogger.debug('msg');
    it('Adds strings', function() {
      expect(log.str).to.equal('a string');
    });
    it('Adds numbers', function() {
      expect(log.num).to.equal(23);
    });
  });

  describe('functions', function() {
    it('Calls functions and applies their return value', function() {
      expect(everyLogger.debug('msg').func).to.equal(0);
    });
    it('Calls functions every time it creates a log', function() {
      x = 27;
      expect(everyLogger.debug('msg').func).to.equal(27);
    });
  });
});

describe('Logger provided field options', function() {
  const falsy = new logClass({
    timestamp: false,
    severity: 0,
    message: null,
    stack: undefined,
  });
  const defaultVals = new logClass();
  const overrides = new logClass({
    timestamp: 'the_ts',
    severity: '123',
    message: 'some thing',
    stack: 'yeah',
  });

  describe('"timestamp" field', function() {
    it('Returns "timestamp" field when parameter is ommitted', function() {
      expect(defaultVals.warn('blah')).to.have.property('timestamp');
    });
    it('Does not return timestamp when constructed with falsy value', function() {
      expect(falsy.warn('blah')).not.to.have.property('timestamp');
    });
    it('Returns name when provided a value', function() {
      expect(overrides.warn('blah')).not.to.have.property('timestamp');
      expect(overrides.warn('blah')).to.have.property('the_ts');
    });
  });

  describe('"ts_function" method', function() {
    it('Calls the timestamp function if one is provided', function() {
      const timestampSpy = sinon.spy();
      const l = new logClass({ ts_function: timestampSpy });
      const log = l.warn('testing ts function');
      expect(timestampSpy).to.have.been.calledOnce;
    });
  });

  describe('"severity" field', function() {
    it('Returns "severity" field when parameter is ommitted', function() {
      expect(defaultVals.warn('blah')).to.have.property('severity');
    });
    it('Does not return severity when constructed with falsy value', function() {
      expect(falsy.warn('blah')).not.to.have.property('severity');
    });
    it('Returns name when provided a value', function() {
      expect(overrides.warn('blah')).not.to.have.property('severity');
      expect(overrides.warn('blah')).to.have.property('123');
    });
  });

  describe('"message" field', function() {
    it('Returns "msg" field when parameter is ommitted', function() {
      expect(defaultVals.warn('blah')).to.have.property('msg');
    });
    it('Does not return message when constructed with falsy value', function() {
      expect(falsy.warn('blah')).not.to.have.property('message');
    });
    it('Returns name when provided a value', function() {
      expect(overrides.warn('blah')).not.to.have.property('msg');
      expect(overrides.warn('blah')).to.have.property('some thing');
    });
  });

  describe('"stack" field', function() {
    it('Returns "stack" field when parameter is ommitted', function() {
      expect(defaultVals.warn('blah')).to.have.property('stack');
    });
    it('Does not return stack when constructed with falsy value', function() {
      expect(falsy.warn('blah')).not.to.have.property('stack');
    });
    it('Returns name when provided a value', function() {
      expect(overrides.warn('blah')).not.to.have.property('stack');
      expect(overrides.warn('blah')).to.have.property('yeah');
    });
  });
});

describe('Log parameters', function() {
  describe('Message', function() {
    it('Adds the message', function() {
      expect(logger.debug('this is the test').msg).to.equal('this is the test');
    });
  });

  // describe('Errors', function() {
  //   // when err passed in
  //   // when string passed in
  // });

  describe('Details', function() {
    const extra = {
      some: 'val',
      its: 1,
      rand: Math.random(),
      a: { deep: { nested: { thing: true } } }
    };

    it('Adds keys to log.details', function() {
      const logger = new logClass();
      const log = logger.info('test', null, extra);
      expect(log.details.some).to.equal('val');
      expect(log.details.its).to.equal(1);
      expect(log.details.rand).to.equal(extra.rand);
    });
    it('Does not adds value non-objects log.details', function() {
      const logger = new logClass();
      const log = logger.info('test', null, 7);
      expect(log.details).not.to.equal(7);
    });
    it('Adds nested objects', function() {
      const logger = new logClass();
      const log = logger.info('test', null, extra);
      expect(log.details).to.have.nested.property('a.deep.nested.thing', true);
    });
    it('Does not override "provided" fields', function() {
      const logger = new logClass({ severity: 'details' });
      const deets = { some: 'data' };
      const log = logger.info('test', null, deets);
      expect(log.details).not.to.equal(deets);
    });
    it('Overrides arguments passed in logger constructor "every"', function() {
      const logger = new logClass({ every: { details: { some: 'things' }}});
      const log = logger.info('test', null, extra);
      expect(log.details.some).not.to.equal('things');
    });
  });


  describe('Stack output', function() {
    const logStack = helper.stackTestFunc(logger, 'debug', 'some msg').stack;
    it('Stack.file is correct', function() {
      const helperfile = path.resolve(__dirname, './helper.js');
      expect(logStack.file).to.equal(helperfile);
    });
    it('Stack.line is correct', function() {
      expect(logStack.line).to.equal(2);
    });
    it('Stack.function is correct', function() {
      expect(logStack.function).to.equal('stackTestFunc');
    });
  });
});

describe('Logger outputs', function() {
  it('Calls each output funciton', function() {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const outLog = new logClass({ outputs: [ spy1, spy2, spy3 ]});
    outLog.warn('Calling outputs!');
    expect(spy1).to.have.been.calledOnce;
    expect(spy2).to.have.been.calledOnce;
    expect(spy3).to.have.been.calledOnce;
  });
  it('Does not throw error if non-function is passed in', function() {
    const notAFunc = 17;
    const badLog = new logClass({ outputs: [notAFunc ]});
    expect(() => badLog.error('Whats going to happen?')).not.to.throw();
  });
});
