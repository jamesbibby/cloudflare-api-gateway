const makeServiceWorkerEnv = require('service-worker-mock');
const assert = require('assert');
const sinon = require('sinon');

const fileUnderTest = '../workers/api-gateway.js';

describe(fileUnderTest, () => {
  const stub = sinon.stub();

  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv(), {
      fetch: stub,
    });
    stub.reset();
    // Remove the worker module cache
    delete require.cache[require.resolve(fileUnderTest)];
    require(fileUnderTest);
  });

  it('should attach the listener', () => {
    assert.equal(self.listeners.size, 1);
  });

  it('should return a 404 for a bad url', async () => {
    const request = new Request('http://api.bibs.codes/');
    const response = await self.trigger('fetch', request);

    assert.equal(stub.callCount, 0);
    assert.equal(response[0].status, 404);
  });

  it('should handle a simple url', async () => {
    const request = new Request('http://api.bibs.codes/service');
    await self.trigger('fetch', request);

    assert.equal(stub.callCount, 1);
    assert.equal(stub.getCall(0).args[0], 'http://service.bibs.codes/');
  });

  it('should handle a complex url', async () => {
    const request = new Request(
      'http://api.bibs.codes/test-service/something?param1=value1&param2=value2'
    );
    await self.trigger('fetch', request);

    assert.equal(stub.callCount, 1);
    assert.equal(
      stub.getCall(0).args[0],
      'http://test-service.bibs.codes/something?param1=value1&param2=value2'
    );
  });
});
