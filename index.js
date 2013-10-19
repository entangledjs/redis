
/**
 * Module dependencies.
 */

var redis = require('redis');

/**
 * Expose `Driver`.
 */

module.exports = Driver;

/**
 * Initialize a redis driver with
 * optional prefix `name` defaulting
 * to "do" with the given `opts`:
 *  - `db` redis client (defaults to `redis.createClient()`)
 *  - `pub` redis client (defaults to `redis.createClient()`)
 *  - `sub` redis client (defaults to `redis.createClient()`)
 *
 * @param {String} name
 * @api public
 */

function Driver(name, opts) {
  if('object' == typeof name) {
    name = 'entangle';
    opts = name;
  }
  this.name = name || 'entangle';
  this.eventsKey = this.name + ':events';
  this.objectKey = this.name + ':objects:';
  this._db = opts.db || redis.createClient();
  this._pub = opts.pub || redis.createClient();
  this._sub = opts.sub || redis.createClient();
  this._sub.on('subscribe', this.onsubscribe.bind(this));
  this._sub.subscribe(this.eventsKey);
  this.buffer = [];
}

/**
 * Handle subscription and flush queued events.
 *
 * @api private
 */

Driver.prototype.onsubscribe = function(){
  this.subscribed = true;
  this.flush();
};

/**
 * Flush queued events.
 *
 * @api private
 */

Driver.prototype.flush = function(){
  this.buffer.forEach(this.pub.bind(this));
  this.buffer = [];
};

/**
 * Load object by `id` and invoke `fn(null, obj)`.
 *
 * @param {String} id
 * @param {Function} fn
 * @api public
 */

Driver.prototype.load = function(id, fn){
  var key = this.objectKey + id;
  this._db.get(key, function(err, json){
    if (err) return fn(err);
    if (!json) return fn(null, {});
    fn(null, JSON.parse(json));
  });
};

/**
 * Save object by `id` and invoke `fn(err)`.
 *
 * @param {String} id
 * @param {Object} obj
 * @param {Function} [fn]
 * @api public
 */

Driver.prototype.save = function(id, obj, fn){
  fn = fn || function(){};
  var key = this.objectKey + id;
  this._db.set(key, JSON.stringify(obj), fn);
};

/**
 * Remove object by `id`.
 *
 * @param {String} id
 * @param {Function} [fn]
 * @api public
 */

Driver.prototype.remove = function(id, fn){
  fn = fn || function(){};
  var key = this.objectKey + id;
  this._db.del(key, fn);
};

/**
 * Publish `msg`.
 *
 * @param {Object} msg
 * @api public
 */

Driver.prototype.pub = function(msg){
  if (this.subscribed) {
    msg = JSON.stringify(msg);
    this._pub.publish(this.eventsKey, msg);
  } else {
    this.buffer.push(msg);
  }
};

/**
 * Subscribe to messages and invoke `fn(msg)`.
 *
 * @param {Function} fn
 * @api public
 */

Driver.prototype.sub = function(fn){
  this._sub.on('message', function(chan, msg){
    fn(JSON.parse(msg));
  });
};
