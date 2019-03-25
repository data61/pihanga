import * as LOGGER from './logger'
import * as REDUX from './redux'
import * as ROUTER from './router'
import * as UTILS from './utils'
import * as START from './start'
import * as CARD_SERVICE from './card.service'

export default {
  createLogger: LOGGER.createLogger,
  REDUX_ACTION_TYPES: REDUX.REDUX_ACTION_TYPES,
  Reducer: REDUX.Reducer,
  dispatch: REDUX.dispatch,
  doActionInReducer: REDUX.doActionInReducer,
  createStore: REDUX.createStore,
  getState: REDUX.getState,
  update: REDUX.update,
  get: REDUX.get,
  init: ROUTER.init,
  ROUTER_ACTION_TYPES: ROUTER.ROUTER_ACTION_TYPES,
  navigateToPage: ROUTER.navigateToPage,
  pathToRegexPatternCache: ROUTER.pathToRegexPatternCache,
  RouterService: ROUTER.RouterService,
  sortBy: UTILS.sortBy,
  prettifyPercentage: UTILS.prettifyPercentage,
  renderTime: UTILS.renderTime,
  humaniseDuration: UTILS.humaniseDuration,
  TIME_UNITS_TO_LABEL: UTILS.TIME_UNITS_TO_LABEL,
  INDETERMINATE_PROPERTY: UTILS.INDETERMINATE_PROPERTY,
  getIntegerNumberRandomiser: UTILS.getIntegerNumberRandomiser,
  prettifyNumber: UTILS.prettifyNumber,
  PiPropTypes: UTILS.PiPropTypes,
  context2InitFunctions: START.context2InitFunctions,
  start: START.start,
  registerCards: CARD_SERVICE.registerCards,
  registerCardComponent: CARD_SERVICE.registerCardComponent,
  card: CARD_SERVICE.card,
  ref: CARD_SERVICE.ref,
  pQuery: CARD_SERVICE.pQuery,
  Card: CARD_SERVICE.Card
}