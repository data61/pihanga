"use strict";

exports.__esModule = true;
exports.default = void 0;

var _styles = require("@material-ui/core/styles");

var _default = (0, _styles.withStyles)(function (theme) {
  return {
    label: {
      color: 'white'
    },
    root: {},
    switchDefault: {
      color: theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[50]
    },
    switchChecked: {
      //color: theme.palette.primary.contrastDefaultColor,
      color: 'white'
    },
    switchBar: {
      backgroundColor: 'white !important',
      opacity: 0.5
    }
  };
});

exports.default = _default;