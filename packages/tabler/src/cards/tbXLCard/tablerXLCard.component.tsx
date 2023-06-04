import { Card } from '@pihanga/core';
import React from 'react';

export type ComponentProps = {
  title: string;
  contentCard: string;
  // children: JSX.Element | JSX.Element[];
  actionCards?: string[];
  infoCards?: string[];
};

type ComponentT = ComponentProps & {
  // onSomething: (ev: SomeEvent) => void;
};

export const Component = (props: ComponentT) => {
  const {
    title,
    contentCard,
    actionCards,
    infoCards,
  } = props;

  function renderTitle() {
    return (
      <div className="col-auto">
        <div className="page-title">
          {title}
        </div>
      </div>
    )
  }


  function renderActions() {
    if (!actionCards) return null;
    return (
      <div className="col">
        {actionCards.map(renderCard)}
      </div>
    )
  }

  function renderInfo() {
    if (!infoCards) return null;
    return (
      <div className="col-auto">
        {infoCards.map(renderCard)}
      </div>
    )
  }

  function renderCard(name: string, idx: number) {
    return (
      <Card cardName={name} key={idx} />
    )
  }

  return (
    <>
      <div className="page-header d-print-none" data-pihanga-comp="tablerXLCard:title">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            {renderTitle()}
            {renderActions()}
            {renderInfo()}
          </div>
        </div>
      </div>
      {/* Page body */}
      <div className="page-body" data-pihanga-comp="tablerXLCard:body">
        <div className="container-xl">
          <div className="card">
            <Card cardName={contentCard} />
          </div>
        </div>
      </div>
    </>
  );
}
