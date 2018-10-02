const chai = require('chai');
const path = require('path');
const logClass = require('../src/class');
const helper = require('./helper');

const expect = chai.expect;
const logger = new logClass({ outputs: [] });

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
  const everyLogger = new logClass({ every, outputs: [] });

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

  describe('"severity" field', function() {
    it('Returns "severity" field when parameter is ommitted', function() {
      expect(defaultVals.warn('blah')).to.have.property('severity');
    });
    it('Does not return severity when constructed with falsy value', function() {
      expect(falsy.warn('blah')).not.to.have.property('severity');
    });
    it('Returns name when provided a value', function() {
      expect(overrides.warn('blah')).not.to.have.property('severity');
      expect(overrides.warn('blah')).to.have.property(123);
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
    const deetsLogger = new logClass({ every: { some: 'thing', rand: 'rand' } });
    const extra = {
      timestamp: 'this is not seen',
      some: 'val',
      its: 1,
      rand: Math.random(),
      a: { deep: { nested: { thing: true } } }
    };
    const log = deetsLogger.warn('test', null, extra);

    it('Adds keys to log', function() {
      expect(log.some).to.equal('val');
      expect(log.its).to.equal(1);
      expect(log.rand).to.equal(extra.rand);
    });
    it('Adds nested objects', function() {
      expect(log).to.have.nested.property('a.deep.nested.thing', true);
    });
    it('Does not override "provided" outputs', function() {
      expect(log.timestamp).not.to.equal('this is not seen');
    });
    it('Overrides arguments passed in logger constructor "every"', function() {
      expect(log.some).not.to.equal('thing');
      expect(log.rand).not.to.equal('rand');
    });
  });


  describe('Stack output', function() {
    const logStack = helper.stackTestFunc(logger, 'debug', 'some msg').stack;
    xit('Stack.file is correct', function() {
      const helperfile = path.resolve('./helper.js')
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
