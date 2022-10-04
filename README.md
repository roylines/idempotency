# idempotency
Use DynamoDB to store idempotency keys and check for replay. Results are cached to protect against multi-replay attacks.

## Installation

``` javascript
> npm install --save idempotency
```



## Usage

Firstly create a dynamodb table to store the keys and values. By default it has the following schema (all can be overriden using configuration see below):

- **Table Name:** idempotency
- **Partition Key:** id
- **TTL Key:** ttl
- **TTL:** 60



### Simple Example

``` javascript
const {check} = require('idempotency');

const myfunc = async({id}) {
  const { replay } = await check({id});
  if(replay) {
    console.error("this is a replay")
  } else {
    console.log("all is good")
  }
}
```



### Example with Configuration

``` javascript
const {check} = require('idempotency');

const config = {
  tablename: 'TABLE',
  idField: 'ID',
  ttlField: 'TTL',
  ttl: 42,
};

const myfunc = async({id}) {
  await configure(config); // should be done once really
  
  const { replay } = await check({id});
  if(replay) {
    console.error("this is a replay")
  } else {
    console.log("all is good")
  }
}
```

