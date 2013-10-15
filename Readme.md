
# do-redis

  Redis server for __DO__.

## Installation

```
$ npm install do-redis
```

## Example

```js
var Client = require('do-redis');
var client = new Client;
var object = require('do')(client);
var conf = object('config');
```

# License

  MIT