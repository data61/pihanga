import React from 'react';
import { N1PropTypes } from 'n1-core';
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
  children: N1PropTypes.children,
};

ErrorMessageComponent.defaultProps = {
  children: undefined,
};
