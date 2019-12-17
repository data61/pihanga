import React from 'react';
import isFunction from 'lodash.isfunction';
//import isEqual from 'lodash.isequal';
import { connect } from 'react-redux';
import { getState, dispatch, registerActions } from './redux';
import { createLogger } from './logger';

const logger = createLogger('card.service');

const cards = {};
const metaCards = {};
const cardComponents = {};

/**
 * Register a meta card which expands a single card definition of type `name`
 * into a new set of cards which can be registered in turn through `registerCards`.
 * 
 * The `transformF` function takes the `cardName` and `cardDef` as the two paramters
 * and is expected to return a map where the keys are new card anmes and their respective
 * values the respective card declaration.
 * 
 * @param {string} type 
 * @param {function} transformF 
 */
export function registerMetaCard(type, transformF) {
  if (metaCards[type]) {
    logger.warn(`Overwriting meta card definition "${type}"`);
  }
  metaCards[type] = transformF;
}

export function registerCards(newCards) {
  Object.keys(newCards).forEach((k) => {
    if (cards[k]) {
      logger.warn(`Overwriting card "${k}"`);
    }
    const cardDef = { ...newCards[k] };
    registerSingleCard(k, cardDef);
  });
}

function registerSingleCard(cardName, cardDef) {
  const { cardType } = cardDef;
  if (!cardType) {
    logger.error(`Reject registration of card "${cardName}" due to missing "cardType"`);
    return;
  }
  if (metaCards[cardType]) {
    expandMetaCard(cardType, cardName, cardDef);
    return;
  }
  const cardComponent = cardComponents[cardType];
  if (!cardComponent) {
    const known = Object.keys(cardComponents).join(', ');
    logger.error(`Reject registration of card "${cardName}" due to unknown cardType "${cardType}" - (${known})`);
    return;
  }
  const { events } = cardComponent;
  if (events) {
    Object.keys(events).forEach((en) => {
      if (!cardDef[en]) {
        // set default event handler: Need to return indirectly as it's going
        // be 'value resolved' in 'getCardState'
        const evtType = events[en];
        // eslint-disable-next-line no-param-reassign
        cardDef[en] = () => (opts = {}) => {
          dispatch({
            type: evtType,
            id: cardName,
            ...opts,
          });
        };
      }
    });
  }
  cards[cardName] = cardDef;
}

export function expandMetaCard(cardType, cardName, cardDef) {
  const transform = metaCards[cardType];
  if (!transform) {
    const known = Object.keys(metaCards).join(', ');
    logger.error(`Reject registration of meta card "${cardName}" due to unknown meta cardType "${cardType}" - (${known})`);
    return;
  }
  const newCards = transform(cardName, cardDef);
  registerCards(newCards);
}

export function registerCardComponent(compDefs) {
  const {
    name, component, actions, events, defaults,
  } = compDefs;
  if (cardComponents[name]) {
    logger.warn(`Overwriting card component "${name}"`);
  }
  if (actions) {
    registerActions(name, actions);
  }
  cardComponents[name] = { cardComponent: component, events, defaults };
}

export function card(name) {
  const cc = cardComponents[name];
  if (!cc) {
    logger.warn(`Requested unknown card "${name}"`);
  }
  return cc;
}

export function ref(cardNameOrF, paramName) {
  return (s) => {
    const cardName = isFunction(cardNameOrF) ? cardNameOrF(s) : cardNameOrF;
    const dynState = s.pihanga[cardName];
    if (dynState) {
      const vd = dynState[paramName];
      if (vd !== undefined) {
        return vd;
      }
    }
    const refDef = cards[cardName];
    if (!refDef) {
      logger.warn(`Requested reference to unknown card "${cardName}"`);
      return null;
    }
    const v = getValue(paramName, refDef, s);
    return v;
  };
}

/**
 * Perform a simple query over the pihanga card states
 * and return an array of query matches where each element
 * is a hash of property bindings for that respective card
 * as listed in `{resProps}` (if defined) in addition to the default
 * `cardName` property.
 *
 * A match succeeds if the targeted property value matches `value` which
 * can either by a 'normal' value responding to `===`, or a function
 * which is expected to return true for a match when called with two parameters,
 * the first being the targeted properties value and the second one being the
 * _Redux_ state.
 *
 * The queries are limited to either declare any of
 * the paramters as wildcard (set to NULL) or an exact
 * match. For instance `pQuery(null, 'isTopLevel', true)`
 * returns all the cards with a parameter 'isTopLevel' with
 * value 'true'.
 *
 * @param {string|function} cardName name/function of card or null indicting a wild card
 * @param {string|function} propName name/function of property to filter on
 * @param {any|function} match value/function to test against property value for match
 * @param {[string]} array of additional card properties to add to each matched result
 */
export function pQuery(cardName, propName, match, resProps) {
  return (s) => {
    const cName = isFunction(cardName) ? cardName(s) : cardName;
    const pName = isFunction(propName) ? propName(s) : propName;
    const matchIsFunction = isFunction(match);
    const cardNames = cName ? [cName] : Object.keys(cards);
    const result = [];
    const addResult = (cn, pn, v) => {
      const params = { cardName: cn };
      params[pn] = v; // matched property
      if (resProps) {
        for (var opn of resProps) {
          if (opn !== pn) { // avoid duplication
            const ov = ref(cn, opn)(s);
            params[opn] = ov;
          }
        }
      }
      result.push(params);
    };
    function addResultIf(cn, pn) {
      const v = ref(cn, pn)(s);
      if (v) {
        const m = matchIsFunction ? match(v, s) : v === match;
        if (m) {
          addResult(cn, pn, v);
        }
      }
    }
    for (var cn of cardNames) {
      if (pName) {
        // single property
        addResultIf(cn, pName);
      } else {
        // parameter wild card
        const cs = getCardState(cn, s);
        for (var pn of Object.keys(cs)) {
          addResultIf(cn, pn);
        }
      }
    }
    return result;
  }
}

function getValue(paramName, cardDef, s) {
  let v = cardDef[paramName];
  if (isFunction(v)) {
    v = v(s, (cn, pn) => {
      const rv = ref(cn, pn)(s);
      return rv;
    });
  }
  return v;
}

// We should create a 'redux connected' wrapper for each card only once
// This is a potential memory leak as we aren't cleaning up, but the entries
// should be limited by the number of defined cards.
//
const ConnectedCards = {};

export const Card = (props) => {
  const { cardName, key, ...dynProps } = props;
  let cc = ConnectedCards[cardName];
  if (!cc) {
    cc = ConnectedCards[cardName] = createConnectedCard(cardName, dynProps);
  }
  const el = React.createElement(cc);
  return el;
};

const createConnectedCard = (cardName, dynProps) => {
  if (!cards[cardName]) {
    return UnknownCard(cardName);
  }

  const state = getState();
  const cardState = getCardState(cardName, state);
  if (!cardState) {
    return UnknownCard(cardName);
  }
  // const cardComponent = cardComponents[cardState.cardType].cardComponent;
  const { cardComponent } = cardComponents[cardState.cardType];
  return connect((state, ownProps) => {
    // const cs = getCardState(cardName, state, ownProps);
    const cs = getCardState(cardName, state, dynProps);
    return cs;
  })(cardComponent);
};

// const extCardStates = {};

// export const Card2 = (opts) => {
//   const { cardName } = opts;
//   if (!cards[cardName]) {
//     return UnknownCard(cardName);
//   }

//   const state = getState();
//   const cardState = getCardState(cardName, state);
//   if (!cardState) {
//     return UnknownCard(cardName);
//   }
//   const { cardComponent } = cardComponents[cardState.cardType];
//   if (!cardComponent) {
//     return UnknownCard(cardName);
//   }
//   const cc = connect((s) => {
//     const cs = { ...getCardState(cardName, s), ...opts };
//     const cache = extCardStates[cardName];
//     if (cache && mapsAreEqual(cache, cs)) {
//       return cache;
//     }
//     extCardStates[cardName] = cs;
//     return cs;
//   })(cardComponent);
//   const el = React.createElement(cc);
//   return el;
// };

// const mapsAreEqual = (map1, map2) => {
//   if (map1.size !== map2.size) {
//     return false;
//   }
//   return Object.entries(map1).find(([k, v]) => map2[k] !== v) === undefined;
// }

const UnknownCard = (cardName) => {
  const s = `Unknown card "${cardName}" - (${Object.keys(cards).join(', ')})`;
  return React.createElement('div', null, s);
};

const cardStates = {};

function getCardState(cardName, state, ownProps = {}) {
  const cache = cardStates[cardName] || {};
  if (cache.state === state) {
    return cache.cardState;
  }

  const cardDef = cards[cardName];
  if (!cardDef.cardType) {
    return undefined;
  }
  const dynState = state.pihanga[cardName] || {};
  const cardState = { ...cardDef, ...dynState, ...ownProps };
  const oldCardState = cache.cardState || {};
  let hasChanged = false;
  for (var k of Object.keys(cardState)) {
    const v = getValue(k, cardState, state);
    const ov = oldCardState[k];
    // As redux and related state is supposed to be close to immutable
    // a simple equivalence check should suffice. 
    if (!hasChanged && v !== ov) {
      // if 'v' is a function ignore difference,
      // but also check for deep differences when object
      // if (!isFunction(v) && !isEqual(v, ov)) {
      //   hasChanged = true;
      // }
      hasChanged = true;
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
  cardStates[cardName] = { state, cardState };
}
