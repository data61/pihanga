"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.UserAvatarComponent = void 0;

var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));

var _react = _interopRequireDefault(require("react"));

var _core = require("@pihanga/core");

var _userAvatar = _interopRequireDefault(require("./user-avatar.style"));

var UserAvatarComponent = function UserAvatarComponent(_ref) {
  var size = _ref.size,
      user = _ref.user;
  var avatarText = user && user.name && user.name[0].toUpperCase() || '';
  return _react.default.createElement(_Avatar.default, {
    size: size,
    style: _userAvatar.default
  }, avatarText);
};

exports.UserAvatarComponent = UserAvatarComponent;
UserAvatarComponent.propTypes = {
  size: _core.PiPropTypes.number.isRequired,
  user: _core.PiPropTypes.shape().isRequired
};