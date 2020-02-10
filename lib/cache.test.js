const {reset, exists, set} = require('./cache');

describe('cache', () => {
  beforeEach(() => {
    reset();
  });

  it('should initially be missing', () => {
    expect(exists(1)).toEqual(false);
  });

  it('should cache', () => {
    set(1);
    expect(exists(1)).toEqual(true);
  });
});
