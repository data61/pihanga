import initReducers from './listing.reducers';
import { ListingCard } from './listing.component';
import { ACTION_TYPES } from './listing.actions';

export * from './listing.actions';
export function init(register) {
  initReducers(register.reducer);
  register.cardComponent({
    name: 'PiListing', 
    component: ListingCard,
    actions: ACTION_TYPES,
  });
}

