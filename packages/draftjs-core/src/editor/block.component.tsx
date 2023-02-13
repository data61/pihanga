import * as React from 'react';
import { EditorBlock, ContentBlock } from 'draft-js';
import styled from './blockComponent.style';
import { PiComponentProps } from './api';

// import React = require('react');

export type Props = PiComponentProps & {
  block: ContentBlock;
  blockProps: {
    type: string;
  };
};

/**
 * Render a block
 */
export const BlockComponent = styled((props: ClassedProps<Props>) => {
  const { block, classes } = props;
  const { type } = props.blockProps;

  // function onRef(node) {
  //   if (!node) {
  //     return;
  //   }
  //   // taken from https://github.com/souporserious/react-measure/blob/master/src/get-content-rect.js
  //   const t = node.offsetTop;

  //   const ch = node.clientHeight;
  //   const styles = getComputedStyle(node);
  //   const mTop = styles ? parseInt(styles.marginTop) : 0;
  //   const mBottom = styles ? parseInt(styles.marginBottom) : 0;
  //   const h = ch + mTop + mBottom;

  //   const m = currentMeasurements.current;
  //   if (m.t !== t || m.h !== h) {
  //     const m = {t, h};
  //     currentMeasurements.current = m;
  //     onChange(m);
  //   }
  // }

  return (
    <div
      data-block-type={type}
      data-section={type}
      data-block-key={block.getKey()}
      className={classes[type]}
    >
      <EditorBlock {...props} />
    </div>
  );
}) as React.FunctionComponent<Props>;

export default BlockComponent;
