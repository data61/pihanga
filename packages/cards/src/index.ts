import { PiRegister } from '@pihanga/core';


// Import all local components
import { init as piSwitcher } from './piSwitcher';
import { init as modalInit } from './modalWrapper';
import { init as imageInit } from './imageCard';
import { init as fileDropInit } from './fileDrop';
import { init as jsonViewerInit } from './jsonViewer';
import { init as flexGridInit } from './flexGrid';
import { init as markdownInit } from './markdown';

export function init(register: PiRegister): void {
  piSwitcher(register);
  modalInit(register);
  imageInit(register);
  fileDropInit(register);
  jsonViewerInit(register);
  flexGridInit(register);
  markdownInit(register);
}

