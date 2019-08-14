"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.PageComponent = exports.registerComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _AppBar = _interopRequireDefault(require("@material-ui/core/AppBar"));

var _Toolbar = _interopRequireDefault(require("@material-ui/core/Toolbar"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Menu = _interopRequireDefault(require("@material-ui/icons/Menu"));

var _KeyboardArrowRight = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowRight"));

var _Refresh = _interopRequireDefault(require("@material-ui/icons/Refresh"));

var _core = require("@pihanga/core");

var _environment = _interopRequireDefault(require("environments/environment"));

var _page = _interopRequireDefault(require("./page.style"));

var components = [];
var pathPrefix = _environment.default.PATH_PREFIX || '';

var registerComponent = function registerComponent(name, priority, path) {
  components.push({
    name: name,
    priority: priority,
    path: pathPrefix + path
  });
  components = components.sort(function (a, b) {
    return b.priority - a.priority;
  });
};

exports.registerComponent = registerComponent;
var NavBar = (0, _page.default)(function (_ref) {
  var _ref$breadcrumbs = _ref.breadcrumbs,
      breadcrumbs = _ref$breadcrumbs === void 0 ? [] : _ref$breadcrumbs,
      _ref$subTitle = _ref.subTitle,
      subTitle = _ref$subTitle === void 0 ? '???' : _ref$subTitle,
      drawerIsOpen = _ref.drawerIsOpen,
      toolbarAddOns = _ref.toolbarAddOns,
      showRefreshButton = _ref.showRefreshButton,
      route = _ref.route,
      onNavMenuClicked = _ref.onNavMenuClicked,
      onRefreshContent = _ref.onRefreshContent,
      onOpenDrawer = _ref.onOpenDrawer,
      classes = _ref.classes;

  function renderBreadcrumbs() {
    return breadcrumbs.slice(0, -1).map(function (b) {
      return _react.default.createElement("div", {
        key: b.title,
        className: classes.appBarBreadcrumbContainer
      }, _react.default.createElement(_Typography.default, {
        variant: "h6",
        noWrap: true,
        className: classes.appBarBreadcrumbText
      }, _react.default.createElement("a", {
        onClick: function onClick() {
          return onNavMenuClicked(b);
        },
        className: classes.appBarBreadcrumbLink
      }, b.title), _react.default.createElement(_KeyboardArrowRight.default, {
        className: classes.appBarBreadcrumbText
      })));
    });
  }

  function RefreshButton() {
    if (!showRefreshButton) return null;
    return _react.default.createElement(_IconButton.default, {
      color: "inherit",
      "aria-label": "refresh logs",
      onClick: function onClick() {
        return onRefreshContent(route.pageType);
      },
      className: classes.refreshButton
    }, _react.default.createElement(_Refresh.default, null));
  }

  return _react.default.createElement(_AppBar.default, {
    className: (0, _classnames.default)(classes.appBar, drawerIsOpen && classes.appBarShift)
  }, _react.default.createElement(_Toolbar.default, {
    disableGutters: !drawerIsOpen,
    className: classes.appToolbar
  }, _react.default.createElement(_IconButton.default, {
    color: "inherit",
    "aria-label": "open drawer",
    onClick: function onClick() {
      return onOpenDrawer();
    },
    className: (0, _classnames.default)(classes.menuButton, drawerIsOpen && classes.hide)
  }, _react.default.createElement(_Menu.default, null)), renderBreadcrumbs(), _react.default.createElement(_Typography.default, {
    variant: "h6",
    color: "inherit",
    noWrap: true,
    className: classes.appBarTitle
  }, subTitle), toolbarAddOns.map(function (f) {
    return f();
  }), _react.default.createElement(RefreshButton, null)));
});
var PageComponent = (0, _page.default)(function (_ref2) {
  var cardName = _ref2.cardName,
      contentCard = _ref2.contentCard,
      navDrawerCard = _ref2.navDrawerCard,
      title = _ref2.title,
      subTitle = _ref2.subTitle,
      breadcrumbs = _ref2.breadcrumbs,
      topMargin = _ref2.topMargin,
      _ref2$showRefreshButt = _ref2.showRefreshButton,
      showRefreshButton = _ref2$showRefreshButt === void 0 ? false : _ref2$showRefreshButt,
      _ref2$toolbarAddOns = _ref2.toolbarAddOns,
      toolbarAddOns = _ref2$toolbarAddOns === void 0 ? [] : _ref2$toolbarAddOns,
      _ref2$drawerIsOpen = _ref2.drawerIsOpen,
      drawerIsOpen = _ref2$drawerIsOpen === void 0 ? true : _ref2$drawerIsOpen,
      _ref2$route = _ref2.route,
      route = _ref2$route === void 0 ? {} : _ref2$route,
      onNavMenuClicked = _ref2.onNavMenuClicked,
      onRefreshContent = _ref2.onRefreshContent,
      onOpenDrawer = _ref2.onOpenDrawer,
      classes = _ref2.classes;
  var appBarPosition = "static"; //"absolute"; // static

  return _react.default.createElement("div", {
    className: classes.root
  }, _react.default.createElement(_AppBar.default, {
    position: appBarPosition,
    color: "default"
  }, _react.default.createElement(_Toolbar.default, {
    className: classes.topToolbar
  }, _react.default.createElement(_Typography.default, {
    variant: "h6",
    color: "inherit"
  }, title))), _react.default.createElement("div", {
    className: classes.appFrame
  }, _react.default.createElement(NavBar, {
    page: {},
    subTitle: subTitle,
    breadcrumbs: breadcrumbs,
    drawerIsOpen: drawerIsOpen,
    route: route,
    toolbarAddOns: toolbarAddOns,
    showRefreshButton: showRefreshButton,
    onNavMenuClicked: onNavMenuClicked,
    onRefreshContent: onRefreshContent,
    onOpenDrawer: onOpenDrawer
  }), _react.default.createElement(_core.Card, {
    cardName: navDrawerCard,
    parentCard: cardName
  }), _react.default.createElement("main", {
    className: (0, _classnames.default)(classes.content, topMargin && classes.contentTopMargin, drawerIsOpen && classes.contentShift)
  }, _react.default.createElement(_core.Card, {
    cardName: contentCard,
    parentCard: cardName
  }))));
});
exports.PageComponent = PageComponent;
PageComponent.propTypes = {
  version: _core.PiPropTypes.shape(),
  user: _core.PiPropTypes.shape()
};
PageComponent.defaultProps = {
  version: undefined,
  user: undefined,
  classes: {}
};