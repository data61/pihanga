import { PiRegister } from '@pihanga/core';

// Import all local components
import { init as reportSizeInit } from './reportSize';
import { init as tbIconInit } from './tbIcon';

export * from './reportSize';
export * from './tbIcon'
//export type * from './tbIcon'

export function init(register: PiRegister): void {
  reportSizeInit(register);
  tbIconInit(register)
}

