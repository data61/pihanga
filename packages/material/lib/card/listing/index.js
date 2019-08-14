"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
var _exportNames = {
  init: true
};
exports.init = init;

var _listing = _interopRequireDefault(require("./listing.reducers"));

var _listing2 = require("./listing.component");

var _listing3 = require("./listing.actions");

Object.keys(_listing3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _listing3[key];
});

function init(register) {
  (0, _listing.default)(register.reducer);
  register.cardComponent({
    name: 'Listing',
    component: _listing2.ListingCard
  });
}