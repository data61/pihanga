import initReducers from './listing.reducers';
import { ListingCard } from './listing.component';

export * from './listing.actions';
export function init(register) {
  initReducers(register.reducer);
  register.cardComponent({
    name: 'Listing', 
    component: ListingCard, 
  });
}

