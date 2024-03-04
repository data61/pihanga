import { PiCardSimpleProps } from '@pihanga/core';
import { Icon as TablerIcon } from '@tabler/icons-react';
import { IconEye, IconAlertCircle } from '@tabler/icons-react';
import React from 'react';

export type ComponentProps = {
  title?: string;
  errorMessage?: string;
  logoUrl?: string;
  logoHeight?: number;
  showLoginPasswordForm?: boolean;
  showLoginTokenForm?: boolean;
  tokenPlaceholder?: string;
  authProviders?: AuthProvider[];
  showSignupLink?: boolean;
  providerPrefix?: string;
  noAccountYet?: string;
  accountSignup?: string;
};

export type AuthProvider = {
  name: string;
  icon: TablerIcon;
}

export type LoginPasswordEvent = {
  email: string;
  password: string;
};

export type LoginTokenEvent = {
  token: string;
};

export type SignupEvent = {};

export type AuthProviderLoginEvent = AuthProvider;


type ComponentT = ComponentProps & {
  onLoginPassword: (ev: LoginPasswordEvent) => void;
  onLoginToken: (ev: LoginTokenEvent) => void;
  onAuthProvider: (ev: AuthProviderLoginEvent) => void;
  onSignUp: (ev: SignupEvent) => void;
};


export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    title = 'Login to your account',
    errorMessage,
    logoUrl,
    logoHeight = 36,
    showLoginPasswordForm,
    showLoginTokenForm,
    tokenPlaceholder = "Token...",
    authProviders = [],
    providerPrefix = 'Login with',
    showSignupLink = true,
    noAccountYet = "Don't have an account yet?",
    accountSignup = 'Sign up',
    onLoginPassword,
    onLoginToken,
    onAuthProvider,
    onSignUp,
    cardName,
  } = props;

  function onPasswordSubmit(ev: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(ev.target as HTMLFormElement)
    const f = (k: string) => (formData.get(k)?.valueOf() || '').toString()
    onLoginPassword({
      email: f('email'),
      password: f('password'),
    })
    ev.preventDefault();
  }

  function onTokenSubmit(ev: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(ev.target as HTMLFormElement)
    const f = (k: string) => (formData.get(k)?.valueOf() || '').toString()
    onLoginToken({
      token: f('token'),
    })
    ev.preventDefault();
  }

  function renderLogo() {
    if (logoUrl === null) return null
    return (
      <div className="text-center mb-4 logo">
        <a href="." className="navbar-brand navbar-brand-autodark">
          <img src={logoUrl} height={logoHeight} alt="" /></a>
      </div>
    )
  }

  function renderErrorMessage() {
    if (!errorMessage) return null

    return (
      <div className="pi-login-error-message alert alert-important alert-danger alert-dismissible" role="alert">
        <span className="pi-login-error-message-icon"><IconAlertCircle /></span>
        <span className="pi-login-error-message-text">{errorMessage}</span>
      </div>
    )

    // return (
    //   <div className="alert alert-important alert-danger alert-dismissible" role="alert">
    //     <div className="d-flex">
    //       <div>
    //         <IconAlertCircle />
    //       </div>
    //       <div>
    //         {errorMessage}
    //       </div>
    //     </div>
    //   </div>
    // )
  }

  //const x: React.FormEventHandler<HTMLFormElement>

  function renderPasswordForm() {
    if (!showLoginPasswordForm) return null

    return (
      <div className="card-body tb-login-form">
        {renderTitle()}
        <form onSubmit={onPasswordSubmit} autoComplete="off" noValidate={true}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input name="email"
              type="email"
              className="form-control tb-form-input tb-form-input-email"
              placeholder="your@email.com"
              autoComplete="off"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">
              Password
              <span className="form-label-description">
                <button className="btn btn-ghost-info" onClick={() => onSignUp({})} tabIndex={-1}>Forgot password?</button>
              </span>
            </label>
            <div className="input-group input-group-flat">
              <input name="password" type="password" className="form-control" placeholder="Your password" autoComplete="off" />
              <span className="input-group-text" style={{ backgroundColor: '-internal-light-dark' }}>
                <a href="#"
                  className="link-secondary"
                  data-bs-toggle="tooltip"
                  aria-label="Show password"
                  data-bs-original-title="Show password"
                  tabIndex={-1}
                >
                  <IconEye />
                </a>
              </span>
            </div>
          </div>
          <div className="mb-2">
            <label className="form-check">
              <input type="checkbox" className="form-check-input" />
              <span className="form-check-label">Remember me on this device</span>
            </label>
          </div>
          <div className="form-footer">
            <button type="submit" className="btn btn-primary w-100">Sign in</button>
          </div>
        </form>
      </div>

    )
  }

  function renderTokenForm() {
    if (!showLoginTokenForm) return null

    return (
      <div className="card-body tb-login-form">
        {renderTitle()}
        <form onSubmit={onTokenSubmit} autoComplete="off" noValidate={true}>
          <div className="mb-3">
            <label className="form-label tb-form-label tb-form-label-access-token">Access Token</label>
            <textarea className="form-control tb-form-input tb-form-input-access-token"
              name="token"
              rows={20}
              placeholder={tokenPlaceholder}
            />
          </div>
          <div className="form-footer">
            <button type="submit" className="btn btn-primary w-100">Sign in</button>
          </div>
        </form>
      </div>
    )
  }

  var titleRendered = false
  function renderTitle() {
    if (titleRendered) return null
    titleRendered = true
    return (
      <div className="card-body tb-login-title">
        < h2 className="h2 text-center mb-4 tb-title" > {title}</h2 >
        {renderErrorMessage()}
      </div>
    )
  }

  function renderAuthProviders() {
    if (authProviders.length === 0) return null

    return (
      <div className="card-body tb-auth-providers">
        {renderTitle()}
        <div className="row">
          {authProviders.map(renderSingleProvider)}
        </div>
      </div>
    )
  }

  function renderSingleProvider(p: AuthProvider, idx: number) {
    const style = {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    }
    return (
      <div className="col" style={style} key={idx}>
        <button className="btn" onClick={() => onAuthProvider(p)}>
          {p.icon && React.createElement(p.icon)}
          {`${providerPrefix} ${p.name}`}
        </button>
      </div>
    )
  }

  function renderSignUp() {
    if (!showSignupLink) return null

    return (
      <div className="text-center text-muted mt-3 tb-signup-link">
        {noAccountYet}
        <button className="btn btn-ghost-primary" onClick={() => onSignUp({})} tabIndex={-1}
        >{accountSignup}</button>
      </div>
    )
  }

  const needSpacer = (showLoginPasswordForm || showLoginTokenForm) && authProviders.length > 0

  return (
    <div className={`d-flex flex-column theme-light pi-tb-login pi-tb-login-${cardName}`} data-pihanga={cardName}>
      <div className="page page-center">
        <div className="container container-tight py-4">
          {renderLogo()}
          <div className="card card-md">
            {renderPasswordForm()}
            {renderTokenForm()}
            {needSpacer && (<div className="hr-text">or</div>)}
            {renderAuthProviders()}
          </div>
          {renderSignUp()}
        </div>
      </div>
    </div>



  )
}  