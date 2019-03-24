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

var logger = (0, _logger.createLogger)('pihanga:start');
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
  var routerComponentWrapper = new _router.RouterComponentWrapper({});
  var getRoute = routerComponentWrapper.getRoute.bind(routerComponentWrapper);
  (0, _router.init)(register.reducer, getRoute);
  register.routing = routerComponentWrapper.registerRouting.bind(routerComponentWrapper);
}

function initReducer(register) {
  var reducer = new _redux.Reducer({});
  register.reducer = reducer.registerReducer.bind(reducer);
  return reducer;
}

function initModules(register, _ref) {
  var inits = _ref.inits,
      initDirs = _ref.initDirs;

  // if (initDirs) {
  //   for (const dir in initDirs) {
  //     registerPackage(dir);
  //   }
  //   const moduleById = {};
  //   for (const m in moduleById) {
  //     logger.debugSilently(`Discovered module ${m}`);
  //     const module = moduleById[m];
  //     if (module.init !== undefined) {
  //       module.init(register);
  //       //   reducer.registerReducer.bind(reducer),
  //       //   routerComponentWrapper.registerRouting.bind(routerComponentWrapper),
  //       // );
  //     } else {
  //       // There can be lots of cases where there is no `init()` since the component doesn't need to
  //       // register any actions OR has any routing config.
  //       // For these cases, it is intentional, thus, printing out this message is not needed
  //       // logger.debug(`Module index "${p}" does NOT contain an init() function`);
  //     }
  //   }
  // }
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

var start = function start(opts) {
  var reducer = initReducer(register, opts);
  initRouting(register, opts);
  initModules(register, opts);

  if (opts.initialCards) {
    (0, _card.registerCards)(opts.initialCards);
  }

  logger.infoSilently('Creating store');
  var store = (0, _redux.createStore)(reducer.rootReducer.bind(reducer), opts.initialReduxState); // // Function to initialise router component
  // // Render main component
  // const rootEl = document.getElementById(elementId);
  // routerComponentWrapper.updateRoute();
  // const mainComp = mainComponent(store, routerComponentWrapper);

  var rcf = function rcf() {
    var rc = _react.default.createElement(opts.rootComponent);

    return rc;
  };

  var mainComponent = _react.default.createElement(_reactRedux.Provider, {
    store: store
  }, rcf()); // const mainComponent = (
  //   <Provider store={store}>
  //     { rcf() }
  //   </Provider>
  // );


  _reactDom.default.render(mainComponent, opts.rootEl);
};

exports.start = start;