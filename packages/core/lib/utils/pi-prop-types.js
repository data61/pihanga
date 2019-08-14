"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.PiPropTypes = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var PiPropTypes = _propTypes.default;
exports.PiPropTypes = PiPropTypes;
PiPropTypes.children = _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node]);
PiPropTypes.route = PiPropTypes.shape({
  routePath: PiPropTypes.string.isRequired,
  paramValueByName: PiPropTypes.shape(),
  // true indicates this route won't be added to browser history, hence the browser location
  // field won't be updated. The page does load the new component of the new route though
  preventAddingHistory: PiPropTypes.bool,
  // true if this route is updated not by this app, but by browser location field
  updatedByBrowser: PiPropTypes.bool
});