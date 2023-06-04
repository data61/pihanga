import { PiRegister } from '@pihanga/core';


// Import all local components
import { init as tbCards } from './cards';
import { init as tbComponents } from './components';

export function init(register: PiRegister): void {
  tbCards(register);
  tbComponents(register);
}
