
# entangle-redis

  Redis driver for entangle.

## Installation

```
$ npm install entangle-redis
```

## Example

```js
var Redis = require('entangle-redis');
var object = require('entangle')(new Redis);
var config = object('config');
```
or
```js
var client = require('redis').createClient();
var Redis = require('entangle-redis');
var object = require('entangle')(new Redis({client:client}));
var config = object('config');
```


# License

  MIT
