"use strict";

exports.__esModule = true;
var _exportNames = {
  findInitFunctions: true,
  getInitFunctions: true,
  init: true
};
exports.findInitFunctions = findInitFunctions;
exports.getInitFunctions = getInitFunctions;
exports.init = init;

var _core = require("@pihanga/core");

var _root = require("./root");

Object.keys(_root).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _root[key];
});

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
  (0, _root.init)(register);

  var ctxt = require.context('.', true, /\.(\/[^/]*){2,}index\.js$/);

  ctxt.keys().forEach(function (m) {
    var c = ctxt(m);

    if (c.init) {
      c.init(register);
    }
  });
}