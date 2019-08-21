import React from 'react';
import isFunction from 'lodash.isfunction';
import isEqual from 'lodash.isequal';

import { getState, dispatch } from './redux';
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
    logger.error(`Reject registration of card "${cardName}" due to unknown cardType "${cardType}"`);
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

export function registerCardComponent({name, component, events, defaults}) {
  if (cardComponents[name]) {
    logger.warn(`Overwriting card component "${name}"`);
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
export function pQuery(cardName, propName, value, optParams) {
  return (s) => {
    const cName = isFunction(cardName) ? cardName(s) : cardName;
    const pName = isFunction(propName) ? propName(s) : propName;
    const val = isFunction(value) ? value(s) : value;
    const cardNames = cName ? [cName] : Object.keys(cards);
    const result = [];
    const addResult = (cn, pn, v) => {
      const params = {};
      params[pn] = v;
      if (optParams) {
        for (var opn of optParams) {
          const ov = ref(cn, opn)(s);
          params[opn] = ov;
        }
      }
      result.push({cardName: cn, params});
    };
    for (var cn of cardNames) {
      if (pName) {
        // single property
        const v = ref(cn, pName)(s);
        if (!val || (val && val === v)) {
          addResult(cn, pName, v);
        }
      } else {
        // parameter wild card
        const cs = getCardState(cn, s);
        for (var pn of Object.keys(cs)) {
          const v = ref(cn, pn)(s);
          if (!val || (val && val === v)) {
            addResult(cn, pn, v);
          }
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
  const s = `Unknown card "${cardName}" - (${cards.join(', ')})`;
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
