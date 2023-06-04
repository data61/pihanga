import React from 'react';
import ReactModal from 'react-modal';

import { Card, PiCardSimpleProps } from '@pihanga/core';

export type ComponentProps = {
  // Primary card to display which is using this modal card
  contentCard: string;
  // Card to display inside the MOdal
  modalCard?: string;
  // String indicating how the content container should be announced
  // to screenreaders 
  contentLabel?: string;
  // Number indicating the milliseconds to wait before closing
  // the modal. [0]
  closeTimeoutMS?: number;
  // Object indicating styles to be used for the modal.
  // It has two keys, `overlay` and `content`.
  // See the [Styles](https://reactcommunity.org/react-modal/styles/) section for more details.
  style?: ModalStyle;
  // Boolean indicating if the modal should use the preventScroll flag when
  // restoring focus to the element that had focus prior to its display. 
  preventScroll?: boolean;

};

export type ModalStyle = {
  overlay: { [k: string]: any };
  content: { [k: string]: any };
}

export type CloseEvent = {};

type ComponentT = ComponentProps & {
  onCloseRequest: (ev: CloseEvent) => void;
};

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    contentCard,
    modalCard,
    contentLabel = "Example Modal",
    closeTimeoutMS = 0,
    preventScroll = false,
    style = { overlay: {}, content: {} },
    onCloseRequest,
    cardName,
  } = props;
  const isOpen = !!modalCard
  const mprops = {
    /* String id to be applied to the content div. */
    id: cardName,
    // Boolean describing if the modal should be shown or not.
    isOpen,
    // String indicating how the content container should be announced
    //   to screenreaders 
    contentLabel,
    // // Function that will be run after the modal has opened.
    // onAfterOpen: undefined,
    // // Function that will be run after the modal has closed.
    // onAfterClose: undefined,
    // Number indicating the milliseconds to wait before closing
    // the modal. 
    closeTimeoutMS,
    // Object indicating styles to be used for the modal.
    // It has two keys, `overlay` and `content`.
    // See the `Styles` section for more details.
    style,
    // Boolean indicating if the modal should use the preventScroll flag when
    // restoring focus to the element that had focus prior to its display. 
    preventScroll,
    // Function that will be run when the modal is requested
    //to be closed (either by clicking on overlay or pressing ESC).
    // Note: It is not called if isOpen is changed by other means.
    onRequestClose: () => {
      onCloseRequest({})
    },
  }

  return (
    <div data-pihanga={cardName}>
      <Card cardName={contentCard} />
      <ReactModal className={`pi-modal pi-modal-${cardName}`} data-pihanga={`${cardName}:modal`} {...mprops}>
        {modalCard && (<Card cardName={modalCard} />)}
      </ReactModal>
    </div>
  );
}
