
import React from 'react';
import { ReduxAction } from '@pihanga/core';
import { IconSearch } from '@tabler/icons-react';

export type ComponentProps = {
  cardName: string;
  name: string; // used in event
  placeholder: string; // for search input field
  ariaLabel: string; // for search input field
};

export type SearchSubmitEvent = {
  name: string;
  searchText: string;
};
export type SearchSubmitAction = ReduxAction & SearchSubmitEvent;

export type SearchUpdateEvent = {
  name: string;
  searchText: string;
};
export type SearchUpdateAction = ReduxAction & SearchUpdateEvent;

type ComponentT = ComponentProps & {
  onSubmit: (ev: SearchSubmitEvent) => void;
  onUpdate: (ev: SearchUpdateEvent) => void;
};

export const Component = (props: ComponentT) => {
  const {
    name,
    placeholder = "Search…",
    ariaLabel = "Search in console",
    cardName,
    onSubmit,
    onUpdate,
  } = props;

  function _onSubmit(el: React.FormEvent<HTMLFormElement>) {
    console.log("SEARCH", el);
  }

  function _onUpdate(el: React.ChangeEvent<HTMLInputElement>) {
    console.log("SEARCH UPDATE", el);
  }

  return (
    <form action="./" method="get" onSubmit={_onSubmit} data-pihanga={cardName}>
      <div className="input-icon">
        <span className="input-icon-addon">
          <IconSearch />
        </span>
        <input type="text"
          value=""
          onChange={_onUpdate}
          className="form-control"
          placeholder={placeholder} aria-label={ariaLabel} />
      </div>
    </form >
  )
}  