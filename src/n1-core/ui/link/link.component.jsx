import React from 'react';
import deepmerge from 'deepmerge';

import { N1PropTypes } from 'n1-core';

import baseStyle from './link.style';

export const LinkComponent = ({ onClick, style, children }) => {
  const s = style ? deepmerge(baseStyle.link, style) : baseStyle.link;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <a style={s} onClick={onClick} title={children}>{children}</a>
  );
};

LinkComponent.propTypes = {
  onClick: N1PropTypes.func.isRequired,
  style: N1PropTypes.shape(),
  children: N1PropTypes.children,
};

LinkComponent.defaultProps = {
  style: {},
  children: undefined,
};
