import React from 'react';
import { Card, PiCardSimpleProps, ReduxAction } from '@pihanga/core';
import cls from 'classnames';

import { IconSearch } from '@tabler/icons-react';
import { TbIcon } from '../../components';

export type ComponentProps = {
  tabs?: NavBarItem[];
  activeTab?: string; // == id in tabs
  showSearch?: boolean;
};

// export type Message = {
//   title: string;
//   message: string;
// };

export type NavBarItem = {
  id: string;
  title: string;
  icon?: string;
  subItems?: SubItem[];
};

export type SubItem = {
  id: string;
  title: string;
};


export type SelectEvent = {
  actionID: string;
};

// export type SelectAction = ReduxAction & SelectEvent;

type ComponentT = ComponentProps & {
  onSelect: (ev: SelectEvent) => void;
};

const DEF_TABS = [
  { id: 'home', title: 'Home' },
  {
    id: 'special', title: 'Special', subItems: [
      { id: 'item1', title: 'Item 1' },
      { id: 'item2', title: 'Item 2' },
      { id: 'item3', title: 'Item 3' },
    ]
  },
  {
    id: 'special2', title: 'Special2', subItems: [
      { id: 'item1', title: 'Item 21' },
      { id: 'item2', title: 'Item 22' },
      { id: 'item3', title: 'Item 23' },
    ]
  },
];


export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    cardName,
    tabs = DEF_TABS,
    activeTab,
    showSearch,
    onSelect,
  } = props;

  function onBarSelect(el: NavBarItem) {
    onSelect({ actionID: el.id });
  }

  function onDropDownSelect(el: NavBarItem) {
    onSelect({ actionID: el.id });
  }

  function onSearch(el: React.FormEvent<HTMLFormElement>) {
    console.log("SEARCH", el);
  }

  function onSearchUpdate(el: React.ChangeEvent<HTMLInputElement>) {
    console.log("SEARCH UPDATE", el);
  }


  function renderSearchBar() {
    if (!showSearch) return;
    return (
      <div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
        {/* <form action="./" method="get" autocomplete="off" novalidate> */}
        <form action="./" method="get" onChange={onSearch}>
          <div className="input-icon">
            <span className="input-icon-addon">
              <IconSearch />
            </span>
            <input type="text" value="" onChange={onSearchUpdate} className="form-control" placeholder="Search…" aria-label="Search in console" />
          </div>
        </form>
      </div>
    )
  }

  function renderItem(el: NavBarItem, idx: number) {
    if (el.subItems) {
      return renderDropDown(el, idx)
    } else {
      return renderSimpleTab(el, idx)
    }
  }

  function renderSimpleTab(el: NavBarItem, idx: number) {
    return (
      <li className={cls("nav-item", { active: el.id === activeTab })} style={{ cursor: 'pointer' }} key={idx}>
        <a className="nav-link" onClick={() => onBarSelect(el)} >
          {renderIcon(el)}
          <span className="nav-link-title">
            {el.title}
          </span >
        </a >
      </li>
    )
  }

  function renderIcon(el: NavBarItem) {
    if (!el.icon) return null;

    return (
      <span className="nav-link-icon d-md-none d-lg-inline-block">
        <TbIcon iconName={el.icon} />
      </span>
    )
  }

  function renderDropDown(el: NavBarItem, idx: number) {
    return (
      <li className={cls("nav-item", "dropdown", { active: el.id === activeTab })} key={idx}>
        <a className="nav-link dropdown-toggle" onSelect={() => null} data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false" >
          {renderIcon(el)}
          <span className="nav-link-title">
            {el.title}
          </span >
        </a>
        <div className="dropdown-menu">
          {el.subItems?.map(renderDropDownItem)}
        </div>
      </li>
    )
  }

  function renderDropDownItem(el: SubItem, idx: number) {
    return (
      <a className="dropdown-item" onClick={() => onDropDownSelect(el)} key={idx}>
        {el.title}
      </a>
    )
  }

  return (
    <div className="navbar-expand-md" data-pihanga={cardName} >
      <div className="collapse navbar-collapse" id="navbar-menu">
        <div className="navbar navbar-light">
          <div className="container-xl">
            <ul className="navbar-nav">
              {tabs.map(renderItem)}
            </ul>
            {renderSearchBar()}
          </div>
        </div>
      </div>
    </div>
  )
}
