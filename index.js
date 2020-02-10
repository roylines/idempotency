const LRU = require('lru-cache');
const cache = new LRU({max: 10});

const check = async ({id}) => {
  // check the cache
  const cached = cache.get(id);
  if (cached) return {replay: true};

  // get the real value
  cache.set(id, true);
  return {replay: false};
};

module.exports = {check};
