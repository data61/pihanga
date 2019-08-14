"use strict";

exports.__esModule = true;

var _logger = require("./logger");

Object.keys(_logger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  exports[key] = _logger[key];
});