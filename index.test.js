const {check, configure} = require('.');
const {put} = require('./lib/ddb');
const {exists, set} = require('./lib/cache');

jest.mock('./lib/ddb');
jest.mock('./lib/cache');

describe('idempotency', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.Date.now = jest.fn(() => 1000);
  });

  it('should return replay true if cached', async () => {
    exists.mockReturnValue(true);
    const {replay} = await check({id: 1});
    expect(replay).toEqual(true);

    expect(exists.mock.calls).toMatchSnapshot();
    expect(set.mock.calls).toMatchSnapshot();
    expect(put.mock.calls).toMatchSnapshot();
  });

  it('should return replay true if not cached, but in ddb', async () => {
    exists.mockReturnValue(false);
    put.mockRejectedValue({code: 'ConditionalCheckFailedException'});

    const {replay} = await check({id: 1});
    expect(replay).toEqual(true);

    expect(exists.mock.calls).toMatchSnapshot();
    expect(set.mock.calls).toMatchSnapshot();
    expect(put.mock.calls).toMatchSnapshot();
  });

  it('should return replay false if not cached, or not in ddb', async () => {
    exists.mockReturnValue(false);
    put.mockResolvedValue();

    const {replay} = await check({id: 1});
    expect(replay).toEqual(false);

    expect(exists.mock.calls).toMatchSnapshot();
    expect(set.mock.calls).toMatchSnapshot();
    expect(put.mock.calls).toMatchSnapshot();
  });

  it('should allow things to be configured', async () => {
    config = {
      tablename: 'TABLE',
      idField: 'ID',
      ttlField: 'TTL',
      ttl: 42,
    };

    exists.mockReturnValue(false);
    put.mockResolvedValue();

    await configure(config);
    await check({id: 1});

    expect(put.mock.calls).toMatchSnapshot();
  });

  /*
  it.skip('can configure', async () => {
    await configure({tablename: 'XX'});
    // TODO assert DDB calls
  });

  it.skip('should return {replay} correctly', async () => {
    const first = await check({id: 1});
    expect(first.replay).toBe(false);
    const second = await check({id: 1});
    expect(second.replay).toBe(true);
  });

  it('should call ddb correctly', async () => {
    const {replay} = await check({id: 3});
    expect(replay).toEqual(false);
  });
  */
});
