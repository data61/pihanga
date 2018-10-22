import React from 'react';
import mapValues from 'lodash.mapvalues';
import isFunction from 'lodash.isfunction';
import isEqual from 'lodash.isequal';

import { getState } from './redux';
import { connect } from 'react-redux';
import { createLogger } from './logger';

const logger = createLogger('card.service');

const cards = {};

export function registerCard(name, cardComponent) {
  if (cards[name]) {
    logger.warn(`Overwriting card "${name}"`);
  }
  cards[name] = cardComponent;
}

export function card(name) {
  const card = cards[name];
  if (!card) {
    logger.warn(`Requested unknown card "${name}"`);
  }
  return card;
}

export const Card = (opts) => {
  const cardState = getCardState(opts);

  const cardComponent = cards[cardState.cardType];
  const cc = connect(s => cardState)(cardComponent);
  const el = React.createElement(cc);
  return el;
};

const cardStates = {};

function getCardState(opts) {
  const cardName = opts.cardName;
  const state = getState();
  const cardDef = state.pihanga[cardName];
  if (! cardDef.cardType) {

  }
  const cache = cardStates[cardName] || {};
  if (cache.state === state) {
    return cache.cardState;
  }
  const t = Object.assign({}, cardDef, opts);
  const cardState = cache.cardState || {};
  var hasChanged = false;
  for (var k of Object.keys(t)) {
    var v = t[k];
    if (isFunction(v)) {
      v = v(state);
    }
    if (hasChanged || !isEqual(cardState[k], v)) {
      hasChanged = true;
      cardState[k] = v;
    }
  }
  if (hasChanged) {
    cacheCardState(cardName, cardState, state);
    return cardState;
  } else {
    return cache.cardState;
  }
}

function cacheCardState(cardName, cardState, state) {
  cardStates[cardName] = { state, cardState};
}

export const createCardElement = (cardName, overrides = {}) => {
  const s = getState();
  const cardDef = s.pihanga[cardName];
  // if (!cardDef) {
  //   return cardNotFoundFunc("page");
  // }
  const cardComponent = card(cardDef.cardType);

  const cardState = mapValues(Object.assign({}, cardDef, overrides), (v, k) => {
    if (isFunction(v)) {
      const cv = v(s);
      return cv;
    }
    return v;
  });
  cardState.cardName = cardName;

  const state = Object.assign({}, s, {card: cardState})
  const el = React.createElement(cardComponent, state);
  return el;
};