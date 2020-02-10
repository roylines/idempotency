const {check} = require('.');

describe('idempotency', () => {
  it('should block replay', async () => {
    const first = await check({id: 1});
    expect(first.replay).toBe(false);
    const second = await check({id: 1});
    expect(second.replay).toBe(true);
  });
});
