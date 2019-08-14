"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.start = exports.context2InitFunctions = void 0;

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _lodash = _interopRequireDefault(require("lodash.isfunction"));

var _router = require("./router");

var _redux = require("./redux");

var _logger = require("./logger");

var _card = require("./card.service");

var _backend = require("./backend");

var logger = (0, _logger.createLogger)('pihanga:core:start');
var register = {
  cardComponent: _card.registerCardComponent,
  cards: _card.registerCards
};

var context2InitFunctions = function context2InitFunctions(ctxt) {
  var initFunctions = ctxt.keys().map(function (m) {
    var c = ctxt(m);
    return c.init;
  });
  return initFunctions;
};

exports.context2InitFunctions = context2InitFunctions;

function initRouting(register, opts) {
  (0, _router.init)(register.reducer, opts);
}

function initReducer(register) {
  var reducer = new _redux.Reducer({});
  register.reducer = reducer.registerReducer.bind(reducer);
  return reducer;
}

function initModules(register, _ref) {
  var inits = _ref.inits,
      initDirs = _ref.initDirs;

  if (inits) {
    for (var i in inits) {
      var f = inits[i];

      if ((0, _lodash.default)(f)) {
        f(register);
      } else {
        logger.warn('Init function "' + f + '" is not a function.');
      }
    }
  }
}

function initStore(reducer, opts) {
  logger.infoSilently('Creating store');
  var state = opts.initialReduxState;

  if (!state.pihanga) {
    state.pihanga = {};
  }

  if (!state.route) {
    state.route = {};
  }

  if (!state.route.path) {
    state.route.path = getPath(opts);
  }

  initPathEvent(opts);
  return (0, _redux.createStore)(reducer.rootReducer.bind(reducer), opts.initialReduxState);
}

function getPath(opts) {
  var path = opts.currentPath();
  return path;
}

function initPathEvent(opts) {
  if (opts.path) {
    (0, _router.navigateToPage)(opts.path, true);
  }
}

var start = function start(opts) {
  var reducer = initReducer(register, opts);
  initRouting(register, opts);
  initModules(register, opts);

  if (opts.initialCards) {
    (0, _card.registerCards)(opts.initialCards);
  }

  if (opts.environment) {
    (0, _backend.config)(opts.environment);
  }

  var store = initStore(reducer, opts);

  var rcf = function rcf() {
    var rc = _react.default.createElement(opts.rootComponent);

    return rc;
  };

  var mainComponent = _react.default.createElement(_reactRedux.Provider, {
    store: store
  }, rcf());

  _reactDom.default.render(mainComponent, opts.rootEl);
};

exports.start = start;