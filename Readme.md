
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
var Redis = require('entangle-redis');
var object = require('entangle')(new Redis({
    host: 'server.host.name',
    port: 1234,
    options: {
        auth_pass: 'password'
    }
}));
var config = object('config');
```


# License

  MIT
