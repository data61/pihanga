import React from 'react';
import { Card, PiCardSimpleProps } from '@pihanga/core';
import { IconSun, IconMoon, IconBell, IconStar } from '@tabler/icons-react';
//import { SecondaryNavBar } from './navBar.component';

export type ComponentProps = {
  title: string;
  titleIcon?: React.FunctionComponent<any> | string;
  contentCard: string;
  userName?: string;
  userAvatar?: React.FunctionComponent<any> | string;
  messages?: Message[];
  actionBar?: string;
  bottomLinks?: BottomLinks[];
  version?: string;
};

export type Message = {
  title: string;
  message: string;
};

export type BottomLinks = {
  title: string;
  url: string;
}

export type LogoutEvent = {};
type ComponentT = ComponentProps & {
  onLogout: (ev: LogoutEvent) => void;
};

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    cardName,
    contentCard,
    title,
    titleIcon,
    userName,
    userAvatar,
    actionBar,
    messages = [], //  = DEF_MESSAGES,
    bottomLinks = [],
    version,
    onLogout,
  } = props;

  function renderLogo() {
    let img = null
    if (titleIcon) {
      if (typeof titleIcon === 'string') {
        img = (<img src="./static/logo.svg" width="110" height="32" alt="Tabler" className="navbar-brand-image" />)
      } else {
        img = React.createElement(titleIcon)
      }
    }
    return (
      <a href=".">
        {img} {title}
      </a>
    )
  }

  function renderLeftNavBar() {
    return (
      <div className="navbar-nav flex-row order-md-last">
        <div className="d-none d-md-flex">
          {/* {renderDarkSwitcher()} */}
          {renderMessageIcon()}
          {renderUserDropDown()}
        </div>
      </div >

    )
  }

  function renderDarkSwitcher() {
    return (
      <>
        <a href="?theme=dark" className="nav-link px-0 hide-theme-dark" title="Enable dark mode" data-bs-toggle="tooltip"
          data-bs-placement="bottom">
          <IconMoon />
        </a>
        <a href="?theme=light" className="nav-link px-0 hide-theme-light" title="Enable light mode" data-bs-toggle="tooltip"
          data-bs-placement="bottom">
          <IconSun />
        </a>
      </>
    )
  }



  function renderMessageIcon() {
    if (!messages || messages.length === 0) {
      return
    }
    return (
      <div className="nav-item dropdown d-none d-md-flex me-3">
        <a href="#" className="nav-link px-0" data-bs-toggle="dropdown" aria-label="Show notifications">
          <IconBell />
          <span className="badge bg-red"></span>
        </a>
        <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Last updates</h3>
            </div>
            <div className="list-group list-group-flush list-group-hoverable">
              {messages.map(renderMessageItem)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderMessageItem(msg: Message) {
    return (
      <div className="list-group-item">
        <div className="row align-items-center">
          <div className="col-auto"><span className="status-dot status-dot-animated bg-red d-block"></span></div>
          <div className="col text-truncate">
            <a href="#" className="text-body d-block">{msg.title}</a>
            <div className="d-block text-muted text-truncate mt-n1">
              {msg.message}
            </div>
          </div>
          {/* <div className="col-auto">
            <a href="#" className="list-group-item-actions">
              <IconStar />
            </a>
          </div> */}
        </div>
      </div>
    )
  }

  function renderUserDropDown() {
    return (
      <div className="nav-item dropdown">
        <a href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
          {renderUserAvatar()}
          {renderUserName()}
        </a>
        <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          {/* <a href="#" className="dropdown-item">Status</a>
          <a href="#" className="dropdown-item">Profile</a>
          <a href="#" className="dropdown-item">Feedback</a>
          <div className="dropdown-divider"></div>
          <a href="./settings.html" className="dropdown-item">Settings</a> */}
          <button onClick={() => onLogout({})} className="dropdown-item">Logout</button>
        </div>
      </div>

    )
  }

  function renderUserName() {
    if (!userName) return null;

    return (
      <div className="d-none d-xl-block ps-2">
        <div>{userName}</div>)
        {/* <div className="mt-1 small text-muted">UI Designer</div> */}
      </div>
    )
  }

  function renderUserAvatar() {
    if (userAvatar == null) return null;

    if (typeof userAvatar === 'string') {
      const style = { backgroundImage: `url(${userAvatar}` }
      return (
        <span className="avatar avatar-sm" style={style} />
      )
    } else {
      return React.createElement(userAvatar, { className: 'avatar' })
    }
  }

  function renderFooter() {
    return (
      <footer className="footer footer-transparent d-print-none">
        <div className="container-xl">
          <div className="row text-center align-items-center flex-row-reverse">
            {renderFooterRight()}
            <div className="col-12 col-lg-auto mt-3 mt-lg-0">
              <ul className="list-inline list-inline-dots mb-0">
                {renderCopyright()}
                <li className="list-inline-item">
                  {version}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  function renderCopyright() {
    return null; // skip copyright for now

    // return (
    //   <li className="list-inline-item">
    //     &nbsp;Copyright &copy; 2022&nbsp;
    //     <a href="." className="link-secondary">CSIRO</a>.
    //     All rights reserved.
    //   </li>
    // )
  }


  function renderFooterRight() {
    return (
      <div className="col-lg-auto ms-lg-auto">
        <ul className="list-inline list-inline-dots mb-0">
          {bottomLinks.map(renderBottomLink)}
        </ul>
      </div>

    )
  }

  function renderBottomLink(l: BottomLinks, key: number) {
    return (
      <li className="list-inline-item" key={key}>
        <a href={l.url} className="link-secondary" target="_blank" rel="noopener" key={key}>{l.title}</a>
      </li>
      //   < li className="list-inline-item" > <a href="./docs/index.html" className="link-secondary">Documentation</a></li >
      // <li className="list-inline-item"><a href="./license.html" className="link-secondary">License</a></li>
      // <li className="list-inline-item"><a href="https://github.com/tabler/tabler" target="_blank" className="link-secondary" rel="noopener">Source code</a></li>

    )
  }

  function renderActionBar() {
    if (!actionBar) return null;
    return (<Card cardName={actionBar} />)
  }

  return (
    <div className={`page pi-tb-page pi-tb-page-${cardName}`} data-pihanga={cardName}>
      {/* Navbar */}
      <header className="navbar navbar-expand-md d-print-none" data-bs-theme="dark">
        <div className="container-xl">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            {renderLogo()}
          </h1>
          {renderLeftNavBar()}
        </div>
      </header>
      {renderActionBar()}

      <div className="page-wrapper">
        <Card cardName={contentCard} />
        {renderFooter()}
      </div>
    </div>

  );
} // as React.FC<ComponentT>;
