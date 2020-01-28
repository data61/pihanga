import React from 'react';
import isFunction from 'lodash.isfunction';
import { connect } from 'react-redux';
import { getState, registerActions } from './redux';
import { createLogger } from './logger';

const logger = createLogger('card.service');

//const cards = {};
const cards2 = {};
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
    if (cards2[k]) {
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
  const { events, eventKeys, defaults } = cardComponent;
  const {props, eventProps} = Object.entries({...(defaults || {}), ...cardDef}).reduce((p, [k,v]) => {
    if (k === 'cardType') return p;
    if (eventKeys.includes(k)) {
      p.eventProps[k] = v;
    } else {
      p.props[k] = v;
    }
    return p;
  }, {props: {}, eventProps: {}});
  cards2[cardName] = {cardType, props, eventProps, events, defaults};
  //cards[cardName] = cardDef;
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
  const eventKeys = events ? Object.keys(events) : [];
  cardComponents[name] = { cardComponent: component, events, eventKeys, defaults };
}

export function card(name) {
  const cc = cardComponents[name];
  if (!cc) {
    logger.warn(`Requested unknown card "${name}"`);
  }
  return cc;
}

export function ref(cardNameOrF, paramName) {
  return (state, ctxtProps = {}) => {
    const cardName = isFunction(cardNameOrF) ? cardNameOrF(state, ctxtProps) : cardNameOrF;
    const dynState = state.pihanga[cardName];
    if (dynState) {
      const vd = dynState[paramName];
      if (vd !== undefined) {
        return vd;
      }
    }
    const refDef = cards2[cardName];
    if (!refDef) {
      logger.warn(`Requested reference to unknown card "${cardName}"`);
      return null;
    }
    const v = getValue(paramName, refDef.props || {}, state, ctxtProps);
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
    const cardNames = cName ? [cName] : Object.keys(cards2);
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

function getValue(paramName, cardDef, state, ctxtProps = {}) {
  let v = cardDef[paramName];
  if (isFunction(v)) {
    v = v(state, (cn, pn) => {
      const rv = ref(cn, pn)(state, ctxtProps);
      return rv;
    }, ctxtProps);
  }
  return v;
}

// We should create a 'redux connected' wrapper for each card only once
// This is a potential memory leak as we aren't cleaning up, but the entries
// should be limited by the number of defined cards.
//
const ConnectedCards = {};

export const Card = (props) => {
  const { cardName, ...ctxtProps } = props;
  let cc = ConnectedCards[cardName];
  if (!cc) {
    cc = createConnectedCard(cardName, ctxtProps);
    if (!cc) {
      return UnknownCard(cardName);
    }
    ConnectedCards[cardName] = cc;
  }
  const el = React.createElement(cc, ctxtProps);
  return el;
};

const createConnectedCard = (cardName, ctxtProps) => {
  const cardDef = cards2[cardName];
  if (!cardDef) {
    return null;
  }

  const state = getState();
  const cardState = getCardState(cardName, state, ctxtProps);
  if (!cardState) {
    return null;
  }
  const { cardComponent } = cardComponents[cardDef.cardType];
  const { eventProps, events } = cardDef;

  return connect(
    (state, ctxtProps) => { // , ctxtProps
      const cs = getCardState(cardName, state, ctxtProps);
      return cs;
    },
    (dispatch, ctxtProps) => {
      let dispProps =  { dispatch, }
      if (events) {
        
        Object.entries(events).reduce((h, [name, evtType]) => {
          let f;
          const cf = eventProps[name];
          if (cf) {
            f = (opts = {}) => {
              const state = getState();
              const refF = (cn, pn) => {
                const rv = ref(cn, pn)(state, ctxtProps);
                return rv;
              };
              cf(opts, state, refF);
            }
          } else {
            // set default event handler
            f = (opts = {}) => {
              dispatch({
                type: evtType,
                id: cardName, // DEPRECATE 
                cardID: cardName, 
                ...opts,
              });
            };
          }
          h[name] = f;
          return h;
        }, dispProps);
      }
      return dispProps;
    },
    (stateProps, dispatchProps) => { // , ownProps
      // do not include 'ownProps' as that shoul dbe taken care of by pihanga binding
      return { ...stateProps, ...dispatchProps };
    }
  )(cardComponent);
};

const UnknownCard = (cardName) => {
  const s = `Unknown card "${cardName}" - (${Object.keys(cards2).join(', ')})`;
  return React.createElement('div', null, s);
};

const cardStates = {};

function isEqualMap(a,b) {
  const ae = Object.entries(a);
  if (ae.length !== Object.keys(b).length) return false;
  return !ae.find(([k,v]) => b[k] !== v);
}

export function getCardState(cardName, state, ctxtProps = {}) {
  const cache = cardStates[cardName] || {};
  if (cache.state === state && isEqualMap(cache.ctxtProps || {}, ctxtProps)) {
    return cache.cardState;
  }

  // const cardDef = cards[cardName];
  const cardDef2 = cards2[cardName];
  if (!cardDef2.cardType) {
    return undefined;
  }
  const dynState = state.pihanga[cardName] || {};
  const cardState = { ...cardDef2.props, ...dynState };
  const oldCardState = cache.cardState || {};
  let hasChanged = false;
  for (var k of Object.keys(cardState)) {
    const v = getValue(k, cardState, state, ctxtProps);
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
    cardState.cardName = cardName;
    cacheCardState(cardName, cardState, state, ctxtProps);
    return cardState;
  } else {
    return oldCardState;
  }
}

function cacheCardState(cardName, cardState, state, ctxtProps) {
  cardStates[cardName] = { state, cardState, ctxtProps };
}
