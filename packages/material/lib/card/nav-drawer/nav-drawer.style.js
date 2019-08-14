"use strict";

exports.__esModule = true;
exports.default = void 0;

var _styles = require("@material-ui/core/styles");

var drawerWidth = 150;
var appBarHeight = 50;

var _default = (0, _styles.withStyles)(function (theme) {
  return {
    hide: {
      display: 'none'
    },
    drawerPaper: {
      position: 'relative',
      height: '100%',
      width: drawerWidth
    },
    drawerInner: {
      height: '100%'
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      height: appBarHeight // [theme.breakpoints.up('sm')]: {
      //   height: 64,
      // },

    }
  };
});

exports.default = _default;