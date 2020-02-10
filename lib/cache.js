let cache = {};

const reset = () => {
  cache = {};
};

const exists = id => {
  return cache[id] == true;
};

const set = id => {
  cache[id] = true;
};

module.exports = {
  reset,
  exists,
  set,
};
