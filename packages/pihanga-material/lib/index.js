"use strict";

exports.__esModule = true;
exports.findInitFunctions = findInitFunctions;
exports.getInitFunctions = getInitFunctions;
exports.init = init;

var _core = require("@pihanga/core");

//import isFunction from 'lodash.isfunction';
function findInitFunctions() {
  var ctxt = require.context('.', true, /\.(\/[^/]*){2,}index\.js$/);

  return ctxt;
}

function getInitFunctions() {
  var initFunctions = (0, _core.context2InitFunctions)(findInitFunctions());
  return initFunctions;
}

function init(register) {
  var ctxt = require.context('.', true, /\.(\/[^/]*){2,}index\.js$/);

  ctxt.keys().map(function (m) {
    var c = ctxt(m);

    if (c.init) {
      c.init(register);
    }
  });
}