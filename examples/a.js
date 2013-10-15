
// $ node --harmony examples/a

var Redis = require('..');
var object = require('entangle')(new Redis);

var config = object('config');

config.on('change', function(){
  console.log(config.title);
});