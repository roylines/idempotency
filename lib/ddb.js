const AWS = require('aws-sdk');

const put = async params => {
  const ddb = new AWS.DynamoDB.DocumentClient();
  const data = await ddb.put(params).promise();
  return data;
};

module.exports = {put};
