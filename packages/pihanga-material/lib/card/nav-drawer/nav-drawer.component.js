"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.NavDrawerCard = void 0;

var _react = _interopRequireDefault(require("react"));

var _Drawer = _interopRequireDefault(require("@material-ui/core/Drawer"));

var _List = _interopRequireDefault(require("@material-ui/core/List"));

var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));

var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _ChevronLeft = _interopRequireDefault(require("@material-ui/icons/ChevronLeft"));

var _core = require("@pihanga/core");

var _navDrawer = _interopRequireDefault(require("./nav-drawer.style"));

var NavDrawerCard = (0, _navDrawer.default)(function (_ref) {
  var drawerIsOpen = _ref.drawerIsOpen,
      navItems = _ref.navItems,
      onOpenDrawer = _ref.onOpenDrawer,
      onCloseDrawer = _ref.onCloseDrawer,
      onClickNavMenu = _ref.onClickNavMenu,
      classes = _ref.classes;

  var NavEntry = function NavEntry(_ref2) {
    var item = _ref2.item;
    return _react.default.createElement(_ListItem.default, {
      key: item.name,
      button: true,
      onClick: function onClick() {
        return onClickNavMenu({
          item: item
        });
      }
    }, _react.default.createElement(_ListItemText.default, {
      primary: item.name
    }));
  };

  return _react.default.createElement(_Drawer.default, {
    variant: "persistent",
    classes: {
      paper: classes.drawerPaper
    },
    open: drawerIsOpen
  }, _react.default.createElement("div", {
    className: classes.drawerInner
  }, _react.default.createElement("div", {
    className: classes.drawerHeader
  }, _react.default.createElement(_IconButton.default, {
    onClick: function onClick() {
      return onCloseDrawer();
    }
  }, _react.default.createElement(_ChevronLeft.default, null))), _react.default.createElement(_Divider.default, null), _react.default.createElement(_List.default, null, navItems.map(function (item) {
    return NavEntry({
      item: item
    });
  })), _react.default.createElement(_Divider.default, null)));
});
exports.NavDrawerCard = NavDrawerCard;
NavDrawerCard.propTypes = {
  card: _core.PiPropTypes.shape() //user: N1PropTypes.shape(),
  //children: N1PropTypes.children.isRequired,

};