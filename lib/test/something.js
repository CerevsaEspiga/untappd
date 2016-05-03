'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _something = require('../something.js');

var _something2 = _interopRequireDefault(_something);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('something', function (t) {
  t.equal((0, _something2.default)(), 'something');
  t.end();
});