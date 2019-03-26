"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.LinkComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));

var _core = require("@pihanga/core");

var _link = _interopRequireDefault(require("./link.style"));

var LinkComponent = function LinkComponent(_ref) {
  var onClick = _ref.onClick,
      style = _ref.style,
      children = _ref.children;
  var s = style ? (0, _deepmerge.default)(_link.default.link, style) : _link.default.link;
  return (// eslint-disable-next-line jsx-a11y/no-static-element-interactions
    _react.default.createElement("a", {
      style: s,
      onClick: onClick,
      title: children
    }, children)
  );
};

exports.LinkComponent = LinkComponent;
LinkComponent.propTypes = {
  onClick: _core.PiPropTypes.func.isRequired,
  style: _core.PiPropTypes.shape(),
  children: _core.PiPropTypes.children
};
LinkComponent.defaultProps = {
  style: {},
  children: undefined
};