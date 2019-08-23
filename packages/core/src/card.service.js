import React from 'react';
import isFunction from 'lodash.isfunction';
import isEqual from 'lodash.isequal';

import { getState, dispatch, registerActions } from './redux';
import { connect } from 'react-redux';
import { createLogger } from './logger';

const logger = createLogger('card.service');

const cards = {};
const cardComponents = {};

export function registerCards(newCards) {
  for (var k of Object.keys(newCards)) {
    if (cards[k]) {
      logger.warn(`Overwriting card "${k}"`);
    }
    const card = Object.assign({}, newCards[k]);
    registerSingleCard(k, card)
  }
}

function registerSingleCard(cardName, card) {
  const cardType = card.cardType;
  if (!cardType) {
    logger.error(`Reject registration of card "${cardName}" due to missing "cardType"`);
    return;
  }
  const cardComponent = cardComponents[cardType];
  if (!cardComponent) {
    const known = Object.keys(cardComponents).join(', ');
    logger.error(`Reject registration of card "${cardName}" due to unknown cardType "${cardType}" - (${known})`);
    return;
  }
  const events = cardComponent.events;
  if (events) {
    for (var en of Object.keys(events)) {
      if (!card[en]) {

        // set default event handler: Need to return indirectly as it's going
        // be 'value resolved' in 'getCardState'
        const evtType = events[en];
        card[en] = () => (opts = {}) => {
          dispatch({ 
            type: evtType, 
            id: cardName,
            ...opts
          });
        }
      }
    }
  }
  cards[cardName] = card;
}

export function registerCardComponent({name, component, actions, events, defaults}) {
  if (cardComponents[name]) {
    logger.warn(`Overwriting card component "${name}"`);
  }
  if (actions) {
    registerActions(name, actions);
  }
  cardComponents[name] = {cardComponent: component, events, defaults};
}

export function card(name) {
  const card = cardComponents[name];
  if (!card) {
    logger.warn(`Requested unknown card "${name}"`);
  }
  return card;
}

export function ref(cardName, paramName) {
  return (s) => {
    if (isFunction(cardName)) {
      cardName = cardName(s);
    }
    const dynState = s.pihanga[cardName];
    if (dynState) {
      const vd = dynState[paramName];
      if (vd !== undefined) {
        return vd;
      }
    }
    const refDef = cards[cardName];
    if (! refDef) {
      logger.warn(`Requested reference to unknown card "${cardName}"`);
      return null;
    }
    const v = getValue(paramName, refDef, s);
    return v;
  }
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
  var v = cardDef[paramName];
  if (isFunction(v)) {
    v = v(s, (cn, pn) => {
      var rv = ref(cn, pn)(s);
      return rv;
    });
  }
  return v;
}

export const Card = ({cardName}) => {
  if (!cards[cardName]) {
    return UnknownCard(cardName);
  }

  const state = getState();
  const cardState = getCardState(cardName, state);
  if (! cardState) {
    return UnknownCard(cardName);
  }
  const cardComponent = cardComponents[cardState.cardType].cardComponent;
  const cc = connect(s => {
    if (s === state) {
      return cardState;
    } else {
      const cs = getCardState(cardName, s);
      return cs;
    }
  })(cardComponent);
  const el = React.createElement(cc);
  return el;
};

const UnknownCard = (cardName) => {
  const s = `Unknown card "${cardName}" - (${Object.keys(cards).join(', ')})`;
  return React.createElement('div', null, s);
};

const cardStates = {};

function getCardState(cardName, state) {
  const cache = cardStates[cardName] || {};
  if (cache.state === state) {
    return cache.cardState;
  }

  const cardDef = cards[cardName];
  if (! cardDef.cardType) {
    return undefined;
  }
  const dynState = state.pihanga[cardName] || {};
  const cardState = Object.assign({}, cardDef, dynState);
  cardState.cardName = cardName;
  const oldCardState = cache.cardState || {};
  var hasChanged = false;
  for (var k of Object.keys(cardState)) {
    const v = getValue(k, cardState, state);
    const ov = oldCardState[k];
    if (!hasChanged && v !== ov) {
      // if 'v' is a function ignore difference, 
      // but also check for deep differences when object
      if (!isFunction(v) && !isEqual(v, ov)) {
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
  cardStates[cardName] = { state, cardState};
}
