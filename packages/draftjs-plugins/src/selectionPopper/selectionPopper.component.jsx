import * as React from 'react';
import { getVisibleSelectionRect } from 'draft-js';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';

import styled from './selectionPopper.style';

/**
 * Show children in a popper located either around `selection`
 * of the bounding rectangle of `domElementID`.
 */
export const SelectionPopper = styled(({
  id = 'selection-popper',
  forceShow = false, // if true, show even without window selection
  placement = 'top',
  fadeInTime = 350,
  selection = null,
  domElementID = null,
  children,
  classes,
}) => {
  const [arrowRef, setArrowRef] = React.useState(null);
  const prevRect = React.useRef(null);

  if (selection === null && domElementID === null) {
    console.log('SelectionPopper hide');
    return null;
  }
  let rect = null;
  if (selection) {
    if (!forceShow && selection.isCollapsed()) {
      console.log('SelectionPopper hide collapsed');
      return null;
    }

    rect = getVisibleSelectionRect(window);
    if (!rect) {
      if (forceShow) {
        rect = prevRect.current;
      }
      if (!rect) {
        // still no rect to anchor popper
        return null;
      }
    } else {
      prevRect.current = rect;
    }
  } else {
    const el = document.querySelector(`[data-link-id="${domElementID}"]`);
    if (!el) {
      console.warn('domElement refers to unknown element id');
      return null;
    }
    rect = el.getBoundingClientRect();
  }
  // console.log('>> POPPER RECT', rect);
  const anchorEl = {
    getBoundingClientRect: () => rect,
    clientWidth: rect.width,
    clientHeight: rect.height,
  };

  const modifiers = {
    flip: {
      enabled: true,
    },
    // preventOverflow: {
    //   enabled: true,
    //   enabled: false,
    //   boundariesElement: 'scrollParent',
    // },
    arrow: {
      enabled: true,
      element: arrowRef,
    },
  };

  return (
    <div>
      <Popper
        id={id}
        open
        anchorEl={anchorEl}
        placement={placement}
        disablePortal={false}
        modifiers={modifiers}
        className={classes.popper}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={fadeInTime}>
            <>
              <span className={classes.arrow} ref={setArrowRef} />
              { children }
            </>
          </Fade>
        )}
      </Popper>
    </div>
  );
});
