"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ListingCard = void 0;

var _react = _interopRequireDefault(require("react"));

var _core = require("@pihanga/core");

var _table = require("../table");

var _listing = require("./listing.actions");

var _listing2 = _interopRequireDefault(require("./listing.style"));

var ListingCard = (0, _listing2.default)(function (_ref) {
  var columns = _ref.columns,
      data = _ref.data,
      cardName = _ref.cardName,
      _ref$scratch = _ref.scratch,
      scratch = _ref$scratch === void 0 ? {} : _ref$scratch,
      classes = _ref.classes;

  function onSelect(row) {
    (0, _listing.onShowDatasetDetail)(row.name);
  }

  return _react.default.createElement(_table.TableCardComponent, {
    id: cardName,
    data: data,
    columns: columns,
    scratch: scratch
  });
});
exports.ListingCard = ListingCard;
ListingCard.propTypes = {//scratch: N1PropTypes.shape().isRequired,
};