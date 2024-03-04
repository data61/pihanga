import React from 'react';
import { Card, PiCardSimpleProps } from '@pihanga/core';
import { closeModalRequest } from '@pihanga/cards/dist/modalWrapper';

export type ComponentProps = {
  title?: string;
  bodyCard: string;
  downloadName?: string;
  downloadBlob?: string; // maybe switch to Blob?
};

// export type SomeEvent = {
//   something: string;
// };

// type ComponentT = ComponentProps & {
//   onSomething: (ev: SomeEvent) => void;
// };

export const Component = (props: PiCardSimpleProps<ComponentProps>) => {
  const {
    title,
    bodyCard,
    downloadName,
    downloadBlob,
    cardName,
  } = props;

  function renderTitle() {
    if (!title) return null

    return (
      <div className="modal-header">
        <h5 className="modal-title">{title}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => closeModalRequest()}></button>
      </div>
    )
  }

  function renderDownloadButton() {
    if (!downloadBlob) return null;

    const fname = downloadName || 'file'
    return (
      <a type="button" href={downloadBlob} download={fname} className="btn btn-primary">Download</a>
    )
  }

  const op = {
    className: `modal modal-blur fade show pi-tb-model-card pi-tb-model-card-${cardName}`,
    'aria-modal': true,
    style: { display: 'block' },
    tabIndex: -1
  }
  return (
    <div {...op} data-pihanga={cardName}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          {renderTitle()}
          <div className="modal-body">
            <Card cardName={bodyCard} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn me-auto" data-bs-dismiss="modal" onClick={() => closeModalRequest()}>Close</button>
            {renderDownloadButton()}
          </div>
        </div>
      </div>
    </div>
  )
}
