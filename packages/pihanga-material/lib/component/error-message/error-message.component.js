"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ErrorMessageComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _core = require("@pihanga/core");

var _errorMessage = _interopRequireDefault(require("./error-message.style"));

var ErrorMessageComponent = function ErrorMessageComponent(_ref) {
  var children = _ref.children;
  return _react.default.createElement("div", null, _react.default.createElement("p", {
    style: _errorMessage.default.errorMessage
  }, _react.default.createElement("xxx", {
    style: _errorMessage.default.errorIcon,
    className: "material-icons",
    title: "Error"
  }, "error"), " ", children));
};

exports.ErrorMessageComponent = ErrorMessageComponent;
ErrorMessageComponent.propTypes = {
  children: _core.PiPropTypes.children
};
ErrorMessageComponent.defaultProps = {
  children: undefined
};