"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.registerCards = registerCards;
exports.registerCardComponent = registerCardComponent;
exports.card = card;
exports.ref = ref;
exports.pQuery = pQuery;
exports.Card = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash.isfunction"));

var _lodash2 = _interopRequireDefault(require("lodash.isequal"));

var _redux = require("./redux");

var _reactRedux = require("react-redux");

var _logger = require("./logger");

var logger = (0, _logger.createLogger)('card.service');
var cards = {};
var cardComponents = {};

function registerCards(newCards) {
  var _arr = Object.keys(newCards);

  for (var _i = 0; _i < _arr.length; _i++) {
    var k = _arr[_i];

    if (cards[k]) {
      logger.warn("Overwriting card \"" + k + "\"");
    }

    var _card = Object.assign({}, newCards[k]);

    registerSingleCard(k, _card);
  }
}

function registerSingleCard(cardName, card) {
  var cardType = card.cardType;

  if (!cardType) {
    logger.error("Reject registration of card \"" + cardName + "\" due to missing \"cardType\"");
    return;
  }

  var cardComponent = cardComponents[cardType];

  if (!cardComponent) {
    logger.error("Reject registration of card \"" + cardName + "\" due to unknown cardType \"" + cardType + "\"");
    return;
  }

  var events = cardComponent.events;

  if (events) {
    var _arr2 = Object.keys(events);

    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
      var en = _arr2[_i2];

      if (!card[en]) {
        (function () {
          // set default event handler: Need to return indirectly as it's going
          // be 'value resolved' in 'getCardState'
          var evtType = events[en];

          card[en] = function () {
            return function (opts) {
              if (opts === void 0) {
                opts = {};
              }

              (0, _redux.dispatch)((0, _extends2.default)({
                type: evtType,
                id: cardName
              }, opts));
            };
          };
        })();
      }
    }
  }

  cards[cardName] = card;
}

function registerCardComponent(_ref) {
  var name = _ref.name,
      component = _ref.component,
      events = _ref.events,
      defaults = _ref.defaults;

  if (cardComponents[name]) {
    logger.warn("Overwriting card component \"" + name + "\"");
  }

  cardComponents[name] = {
    cardComponent: component,
    events: events,
    defaults: defaults
  };
}

function card(name) {
  var card = cardComponents[name];

  if (!card) {
    logger.warn("Requested unknown card \"" + name + "\"");
  }

  return card;
}

function ref(cardName, paramName) {
  return function (s) {
    if ((0, _lodash.default)(cardName)) {
      cardName = cardName(s);
    }

    var dynState = s.pihanga[cardName];

    if (dynState) {
      var vd = dynState[paramName];

      if (vd !== undefined) {
        return vd;
      }
    }

    var refDef = cards[cardName];

    if (!refDef) {
      logger.warn("Requested reference to unknown card \"" + cardName + "\"");
      return null;
    }

    var v = getValue(paramName, refDef, s);
    return v;
  };
}
/**
 * Perform a simple query over the pihanga card states
 * and return an array of results where each elements
 * is a hash of `{cardName, params}`, where `params`
 * is a hash of the `{name, value}`. The parameters listed
 * in `params` include the initial `paramName` (if defined),
 * and all parameters listed in `optParams`.
 * 
 * The queries are limited to either declare any of
 * the paramters as wildcard (set to NULL) or an exact
 * match. For instance `pQuery(null, 'isTopLevel', true)` 
 * returns all the cards with a parameter 'isTopLevel' with
 * value 'true'.
 * 
 * @param {string} cardName 
 * @param {string} propName 
 */


function pQuery(cardName, propName, value, optParams) {
  return function (s) {
    var cName = (0, _lodash.default)(cardName) ? cardName(s) : cardName;
    var pName = (0, _lodash.default)(propName) ? propName(s) : propName;
    var val = (0, _lodash.default)(value) ? value(s) : value;
    var cardNames = cName ? [cName] : Object.keys(cards);
    var result = [];

    var addResult = function addResult(cn, pn, v) {
      var params = {};
      params[pn] = v;

      if (optParams) {
        for (var _iterator = optParams, _isArray = Array.isArray(_iterator), _i3 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray) {
            if (_i3 >= _iterator.length) break;
            _ref2 = _iterator[_i3++];
          } else {
            _i3 = _iterator.next();
            if (_i3.done) break;
            _ref2 = _i3.value;
          }

          var opn = _ref2;
          var ov = ref(cn, opn)(s);
          params[opn] = ov;
        }
      }

      result.push({
        cardName: cn,
        params: params
      });
    };

    for (var _iterator2 = cardNames, _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i4 >= _iterator2.length) break;
        _ref3 = _iterator2[_i4++];
      } else {
        _i4 = _iterator2.next();
        if (_i4.done) break;
        _ref3 = _i4.value;
      }

      var cn = _ref3;

      if (pName) {
        // single property
        var v = ref(cn, pName)(s);

        if (!val || val && val === v) {
          addResult(cn, pName, v);
        }
      } else {
        // parameter wild card
        var cs = getCardState(cn, s);

        var _arr3 = Object.keys(cs);

        for (var _i5 = 0; _i5 < _arr3.length; _i5++) {
          var pn = _arr3[_i5];

          var _v = ref(cn, pn)(s);

          if (!val || val && val === _v) {
            addResult(cn, pn, _v);
          }
        }
      }
    }

    return result;
  };
}

function getValue(paramName, cardDef, s) {
  var v = cardDef[paramName];

  if ((0, _lodash.default)(v)) {
    v = v(s, function (cn, pn) {
      var rv = ref(cn, pn)(s);
      return rv;
    });
  }

  return v;
}

var Card = function Card(_ref4) {
  var cardName = _ref4.cardName;

  if (!cards[cardName]) {
    return UnknownCard(cardName);
  }

  var state = (0, _redux.getState)();
  var cardState = getCardState(cardName, state);

  if (!cardState) {
    return UnknownCard(cardName);
  }

  var cardComponent = cardComponents[cardState.cardType].cardComponent;
  var cc = (0, _reactRedux.connect)(function (s) {
    if (s === state) {
      return cardState;
    } else {
      var cs = getCardState(cardName, s);
      return cs;
    }
  })(cardComponent);

  var el = _react.default.createElement(cc);

  return el;
};

exports.Card = Card;

var UnknownCard = function UnknownCard(cardName) {
  return _react.default.createElement('div', null, "Unknown card \"" + cardName + "\"");
};

var cardStates = {};

function getCardState(cardName, state) {
  var cache = cardStates[cardName] || {};

  if (cache.state === state) {
    return cache.cardState;
  }

  var cardDef = cards[cardName];

  if (!cardDef.cardType) {
    return undefined;
  }

  var dynState = state.pihanga[cardName] || {};
  var cardState = Object.assign({}, cardDef, dynState);
  cardState.cardName = cardName;
  var oldCardState = cache.cardState || {};
  var hasChanged = false;

  var _arr4 = Object.keys(cardState);

  for (var _i6 = 0; _i6 < _arr4.length; _i6++) {
    var k = _arr4[_i6];
    var v = getValue(k, cardState, state);
    var ov = oldCardState[k];

    if (!hasChanged && v !== ov) {
      // if 'v' is a function ignore difference, 
      // but also check for deep differences when object
      if (!(0, _lodash.default)(v) && !(0, _lodash2.default)(v, ov)) {
        hasChanged = true;
      }
    }

    cardState[k] = v;
  }

  if (hasChanged) {
    cacheCardState(cardName, cardState, state);
    return cardState;
  } else {
    return oldCardState;
  }
}

function cacheCardState(cardName, cardState, state) {
  cardStates[cardName] = {
    state: state,
    cardState: cardState
  };
}