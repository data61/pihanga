import cardDefsF from './cars.pihanga';
import initReducers from './cars.reducers';

export function bootstrapInit(opts) {
  const cardDefs = cardDefsF(opts);
  return register => {
    register.cards(cardDefs);
    initReducers(register.reducer);
  };
}

if (window.Pihanga) {
  window.Pihanga.BootstrapInit.push(bootstrapInit);
}
