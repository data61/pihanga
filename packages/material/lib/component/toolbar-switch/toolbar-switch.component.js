"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ToolbarSwitch = void 0;

var _react = _interopRequireDefault(require("react"));

var _Switch = _interopRequireDefault(require("@material-ui/core/Switch"));

var _FormControlLabel = _interopRequireDefault(require("@material-ui/core/FormControlLabel"));

var _toolbarSwitch = _interopRequireDefault(require("./toolbar-switch.style"));

//import { createScratch } from 'n1-core/app';
//import {  } from './toolbar-switch.actions';
var ToolbarSwitch = (0, _toolbarSwitch.default)(function (_ref) {
  var label = _ref.label,
      _ref$checked = _ref.checked,
      checked = _ref$checked === void 0 ? false : _ref$checked,
      onChange = _ref.onChange,
      classes = _ref.classes;
  var cl = {
    default: classes.switchDefault,
    checked: classes.switchChecked,
    bar: classes.switchBar
  };
  return _react.default.createElement(_FormControlLabel.default, {
    control: _react.default.createElement(_Switch.default, {
      checked: checked,
      classes: cl
    }),
    label: label,
    onChange: onChange || function () {},
    classes: {
      label: classes.label,
      root: classes.root
    }
  });
});
exports.ToolbarSwitch = ToolbarSwitch;