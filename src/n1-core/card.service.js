import React from 'react';
import mapValues from 'lodash.mapvalues';
import isFunction from 'lodash.isfunction';
import isEqual from 'lodash.isequal';

import { getState } from './redux';
import { connect } from 'react-redux';
import { createLogger } from './logger';
import { dispatch } from 'n1-core';

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

// export function dynamic(paramName) {
//   return (s, defParamName, cardDef) => {
//     return getValue(paramName || defParamName, cardDef, s);
//   }
// }

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
    const v = getValue(paramName, refDef, s);
    return v;
  }
}

function getValue(paramName, cardDef, s, cardState) {
  var v = cardDef[paramName];
  if (isFunction(v)) {
    v = v(s, (cn, pn) => {
      var i = 0;
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
      if (cs !== cardState) {
        const x  =0;
      }
      return cs;
    }
  })(cardComponent);
  const el = React.createElement(cc);
  return el;
};

const UnknownCard = (cardName) => (
  <div>{`Unknown card "${cardName}"`}</div>
);

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

// export const createCardElement = (cardName, overrides = {}) => {
//   const s = getState();
//   const cardDef = s.pihanga[cardName];
//   // if (!cardDef) {
//   //   return cardNotFoundFunc("page");
//   // }
//   const cardComponent = card(cardDef.cardType);

//   const cardState = mapValues(Object.assign({}, cardDef, overrides), (v, k) => {
//     if (isFunction(v)) {
//       const cv = v(s);
//       return cv;
//     }
//     return v;
//   });
//   cardState.cardName = cardName;

//   const state = Object.assign({}, s, {card: cardState})
//   const el = React.createElement(cardComponent, state);
//   return el;
// };