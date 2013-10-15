
/**
 * Module dependencies.
 */

var redis = require('redis');

/**
 * Expose `Client`.
 */

module.exports = Client;

/**
 * Initialize a redis client with
 * optional prefix `name` defaulting
 * to "do".
 *
 * @param {String} name
 * @api public
 */

function Client(name) {
  this.name = name || 'do';
  this.eventsKey = this.name + ':events';
  this.objectKey = this.name + ':objects:';
  this._db = redis.createClient();
  this._pub = redis.createClient();
  this._sub = redis.createClient();
  this._sub.on('subscribe', this.onsubscribe.bind(this));
  this._sub.subscribe(this.eventsKey);
  this.buffer = [];
}

/**
 * Handle subscription and flush queued events.
 *
 * @api private
 */

Client.prototype.onsubscribe = function(){
  this.subscribed = true;
  this.flush();
};

/**
 * Flush queued events.
 *
 * @api private
 */

Client.prototype.flush = function(){
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

Client.prototype.load = function(id, fn){
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

Client.prototype.save = function(id, obj, fn){
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

Client.prototype.remove = function(id, fn){
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

Client.prototype.pub = function(msg){
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

Client.prototype.sub = function(fn){
  this._sub.on('message', function(chan, msg){
    fn(JSON.parse(msg));
  });
};