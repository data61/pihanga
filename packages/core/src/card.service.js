import React from 'react';
import isFunction from 'lodash.isfunction';
import merge from 'lodash.merge';
import { connect } from 'react-redux';
import { getState, registerActions } from './redux';
import { createLogger } from './logger';

const logger = createLogger('card.service');

const cards = {};
const metaCards = {};
const metaCard2cards = {}; // mapping from instantiated meta cards to their respective cards
const cardComponents = {};

const WITH_CARD_TRACING = false; // process.env.NODE_ENV !== 'production'; // not yet working

export const ParentContext = React.createContext(null);

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
    addCard(k, cardDef);
  });
}

export function addCard(cardName, cardDef) {
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
  const { props, eventProps } = Object.entries({ ...(defaults || {}), ...cardDef }).reduce((p, [k, v]) => {
    if (k === 'cardType') return p;
    if (eventKeys.includes(k)) {
      p.eventProps[k] = v;
    } else {
      p.props[k] = v;
    }
    return p;
  }, { props: {}, eventProps: {} });
  cards[cardName] = {
    cardType, props, eventProps, events, defaults, childCards: [],
  };
  // cards[cardName] = cardDef;
}

export function removeCard(cardName) {
  if (metaCard2cards[cardName]) {
    metaCard2cards[cardName].forEach((cn) => removeCard(cn));
    delete metaCard2cards[cardName];
    return;
  }

  if (!(delete cards[cardName])) {
    logger.warn(`Attempting to remove unknown card '${cardName}'.`);
  }
}

export function expandMetaCard(cardType, cardName, cardDef) {
  const transform = metaCards[cardType];
  if (!transform) {
    const known = Object.keys(metaCards).join(', ');
    logger.error(`Reject registration of meta card "${cardName}" due to unknown meta cardType "${cardType}" - (${known})`);
    return;
  }
  const newCards = transform(cardName, cardDef);
  metaCard2cards[cardName] = Object.keys(newCards);
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
  cardComponents[name] = {
    cardComponent: component, events, eventKeys, defaults,
  };
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
    const refDef = cards[cardName];
    if (!refDef) {
      logger.warn(`Requested reference to unknown card "${cardName}"`);
      return null;
    }
    const v = getValue(paramName, refDef.props || {}, state, ctxtProps, cardName);
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
        resProps.forEach((opn) => {
          if (opn !== pn) { // avoid duplication
            const ov = ref(cn, opn)(s);
            params[opn] = ov;
          }
        });
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
    cardNames.forEach((cn) => {
      if (pName) {
        // single property
        addResultIf(cn, pName);
      } else {
        // parameter wild card
        const cs = getCardState(cn, s);
        Object.keys(cs).forEach((pn) => addResultIf(cn, pn));
      }
    });
    return result;
  };
}

export function getParamValue(paramName, cardName, state, ctxtProps = {}, includeDefaults = true) {
  const cache = CardStatesCache[cardName] || {};
  if (cache.state === state) {
    return cache.cardState[paramName];
  }

  const cardDef = cards[cardName];
  if (!cardDef) {
    throw new Error(`Unknonw card '${cardName}'`);
  }

  // Step 1: Dynamic value in state.pihanga
  const dynState = state.pihanga[cardName];
  if (dynState) {
    const vd = dynState[paramName];
    if (vd !== undefined) {
      return vd;
    }
  }

  // Step 2: Static definition
  let v = ctxtProps[paramName];
  if (typeof v === 'undefined') {
    v = cardDef.props[paramName]; // need to avoid boolean
  }
  // Step 3: Use defaults
  if (typeof v === 'undefined' && includeDefaults && cardDef.defaults) {
    v = cardDef.defaults[paramName];
  }
  if (isFunction(v)) {
    v = v(state, (cn, pn) => {
      const cn2 = cn || cardName;
      const rv = getParamValue(pn, cn2, state, ctxtProps, cn2 !== cardName);
      return rv;
    }, {}, cardName);
  }
  return v;
}

function getValue(paramName, cardDef, state, ctxtProps, cardName) {
  let v = ctxtProps[paramName];
  if (typeof v === 'undefined') v = cardDef[paramName]; // need to avoid boolean
  if (isFunction(v)) {
    v = v(state, (cn, pn) => {
      const rv = ref(cn || cardName, pn)(state, ctxtProps);
      return rv;
    }, ctxtProps, cardName);
  }
  return v;
}

// We should create a 'redux connected' wrapper for each card only once
// This is a potential memory leak as we aren't cleaning up, but the entries
// should be limited by the number of defined cards.
//
const ConnectedCards = {};

export const Card = (props) => {
  const { cardName, cardKey, ...ctxtProps } = props;
  let cc = ConnectedCards[cardName];
  if (!cc) {
    cc = createConnectedCard(cardName, ctxtProps, cardKey);
    if (!cc) {
      return UnknownCard(cardName);
    }
    ConnectedCards[cardName] = cc;
  }
  const el = React.createElement(cc, ctxtProps);
  return el;
};

const createConnectedCard = (cardName, ctxtProps, cardKey) => {
  const cardDef = cards[cardName];
  if (!cardDef) {
    return null;
  }
  let { cardComponent } = cardComponents[cardDef.cardType];
  cardComponent.displayName = `Card:${cardName}`;

  if (WITH_CARD_TRACING) {
    const state = getState();
    const cardState = getCardState(cardName, state, ctxtProps, cardKey);
    if (!cardState) {
      return null;
    }
    // let { cardComponent } = cardComponents[cardDef.cardType];
    // cardComponent.displayName = `Card:${cardName}`;

    const cc = cardComponent;
    cardComponent = (props) => {
      return React.createElement(ParentContext.Consumer, null, (parentCardName) => {
        console.log(`== ${cardName}`, parentCardName, props);
        const el = React.createElement(cc, { parentCardName, ...props });
        return React.createElement(ParentContext.Provider, { value: cardName }, el);
      });
    };
  } else {
    // nothing
  }

  // cardComponent.render = (...args) => {
  //   console.log(`IN>> ${cardName}`, args);
  //   const r = render(...args);
  //   console.log(`OUT>> ${cardName}`, r);
  //   return r;
  // };

  // const origCardComponent = cardComponent;
  // const handler = {
  //   get: (target, prop) => {
  //     console.log(`GET>> ${cardName} - ${prop}`);
  //     return target[prop];
  //   },
  //   // // apply is the [[Call]] trap
  //   // apply: (target, _, args) => {
  //   //   console.log(`IN>> ${cardName}`);
  //   //   const res = target(...args);
  //   //   console.log(`OUT>> ${cardName} - ${res}`);
  //   //   return res;
  //   // },
  //   // construct: (target, args) => {
  //   //   console.log(`NEW>> ${cardName}`);
  //   //   return new target(...args);
  //   // },
  // };
  // cardComponent = new Proxy(origCardComponent, handler);
  // }

  const { eventProps, events } = cardDef;

  return connect(
    (state2, ctxtProps2) => { // , ctxtProps
      const cs = getCardState(cardName, state2, ctxtProps2, cardKey);
      return cs;
    },
    (dispatch, ctxtProps2) => {
      const dispProps = { dispatch };
      if (events) {
        Object.entries(events).reduce((h, [name, evtType]) => {
          let f;
          const cf = eventProps[name];
          if (cf) {
            f = (opts = {}) => {
              const state2 = getState();
              const refF = (cn, pn) => {
                const rv = ref(cn, pn)(state2, ctxtProps2);
                return rv;
              };
              cf(opts, state2, refF);
            };
          } else {
            // set default event handler
            f = (opts = {}) => {
              let o = opts;
              if ('type' in o) {
                logger.error(`event options for "${evtType}" from "${cardName}" cannot not include "type". Will change to "_type"`);
                o = {
                  _type: opts.type,
                  ...opts,
                };
                delete o.type;
              }
              setTimeout(() => {
                dispatch({
                  type: evtType,
                  // id: cardName, // DEPRECATE
                  cardID: cardName,
                  ...o,
                });
              }, 0);
            };
          }
          h[name] = f;
          return h;
        }, dispProps);
      }
      return dispProps;
    },
    (stateProps, dispatchProps) => {// , ownProps
      // do not include 'ownProps' as that should be taken care of by pihanga binding
      const p = { ...stateProps, ...dispatchProps };
      console.log(`>> ${stateProps.cardName}`, stateProps);
      return p;
    },
  )(cardComponent);
};

// function wrapParentContext() {
//   // <ParentContext.Consumer>
//   //                 {parent => {
//   //                     console.log('I am:', this, ' my parent is:',parent ? parent.name : 'null');
//   //                     return(
//   //                         <ParentContext.Provider value={this}>
//   //                             <componentClass ref={inst=>refToInstance=inst} parent={parent} {...this.props} />
//   //                         </ParentContext.Provider>
//   //                     )}
//   //                 }
//   //                 </ ParentContext.Consumer>


// }

const UnknownCard = (cardName) => {
  const s = `Unknown card "${cardName}" - (${Object.keys(cards).join(', ')})`;
  return React.createElement('div', null, s);
};

const CardStatesCache = {};

function isEqualMap(a, b) {
  const ae = Object.entries(a);
  if (ae.length !== Object.keys(b).length) return false;
  return !ae.find(([k, v]) => b[k] !== v);
}

export function getCardState(cardName, state, ctxtProps = {}, cardKey = undefined) {
  const cacheName = cardKey ? `${cardName}-${cardKey}` : cardName;
  const cache = CardStatesCache[cacheName] || {};
  if (cache.state === state && isEqualMap(cache.ctxtProps || {}, ctxtProps)) {
    return cache.cardState;
  }

  // const cardDef = cards[cardName];
  const cardDef2 = cards[cardName];
  if (!cardDef2.cardType) {
    return undefined;
  }
  const dynState = state.pihanga[cardName] || {};
  // eslint-disable-next-line prefer-const
  let cardState = {}; // not really a const
  merge(cardState, cardDef2.props, dynState);
  const params = Object.keys(cardState);
  if (params.length === 0) {
    // no parameters
    return { cardName };
  }

  const oldCardState = cache.cardState || {};
  let hasChanged = false;
  params.forEach((k) => {
    const v = getValue(k, cardState, state, ctxtProps, cardName);
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
  });
  // console.log('>>> CARD STATE', cardName, hasChanged, cardState);
  if (hasChanged || !CardStatesCache[cacheName]) {
    cardState.cardName = cardName;
    CardStatesCache[cacheName] = { state, cardState, ctxtProps };
    return cardState;
  } else {
    return oldCardState;
  }
}

