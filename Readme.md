
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
var db = require('redis').createClient(),
    pub = require('redis').createClient(),
    sub = require('redis').createClient();

var Redis = require('entangle-redis');
var object = require('entangle')(new Redis({
    db: db,
    pub: pub,
    sub: sub
}));
var config = object('config');
```


# License

  MIT
