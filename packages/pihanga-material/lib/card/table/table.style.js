"use strict";

exports.__esModule = true;
exports.default = void 0;

var _styles = require("@material-ui/core/styles");

var _default = (0, _styles.withStyles)(function (theme) {
  return {
    paper: {
      width: '100%',
      marginTop: 0,
      overflowX: 'auto'
    },
    title: {
      marginLeft: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 1
    },
    tableCell: {
      cursor: 'pointer',
      width: 'auto'
    },
    tableCell_dense: {
      paddingRight: 5,
      paddingLeft: 10
    },
    tableCell_fill: {
      width: '100%'
    },
    table_head_row: {
      height: 40
    }
  };
});

exports.default = _default;