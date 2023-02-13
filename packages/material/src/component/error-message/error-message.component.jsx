import React from 'react';
import { PiPropTypes } from '@pihanga/core';
import style from './error-message.style';

export const ErrorMessageComponent = ({ children }) => (
  <div>
    <p style={style.errorMessage}>
      <xxx
        style={style.errorIcon}
        className="material-icons"
        title="Error"
      >
        error
      </xxx> {children}
    </p>
  </div>
);

ErrorMessageComponent.propTypes = {
  children: PiPropTypes.children,
};

ErrorMessageComponent.defaultProps = {
  children: undefined,
};
