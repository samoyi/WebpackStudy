"use strict";

let config = require('./data.json');


module.exports = function() {
  let greet = document.createElement('div');
  greet.textContent = config.greetText;
  return greet;
};