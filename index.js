const cache = require('./lib/cache');
const ddb = require('./lib/ddb');

let _config = {
  tablename: 'idempotency',
  idField: 'id',
  ttlField: 'ttl',
  ttl: 60,
};

const configure = async config => {
  _config = {..._config, ...config};
};

const checkDynamoDB = async ({id}) => {
  let ttl = Math.floor(Date.now() / 1000) + 60;

  let params = {
    TableName: _config.tablename,
    ConditionExpression: `attribute_not_exists(${_config.idField})`,
    Key: {},
    Item: {},
  };

  params.Key[_config.idField] = id.toString();
  params.Item[_config.idField] = id.toString();
  params.Item[_config.ttlField] = ttl;

  try {
    await ddb.put(params);
    return {replay: false};
  } catch (e) {
    if (e.code == 'ConditionalCheckFailedException') {
      return {replay: true};
    }
    throw e;
  }
};

const check = async ({id}) => {
  // check the cache
  if (cache.exists(id)) return {replay: true};

  const ret = await checkDynamoDB({id});
  cache.set(id);
  return ret;
};

module.exports = {
  configure,
  check,
};
