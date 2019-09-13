import React from 'react';
import { withContentRect } from 'react-measure';

/**
 * Render child with additional properties 'width' and 'height' set.
 * The 'width' is the width of the enclosing 'div' while the height
 * is set to 'width * aspectRatio'.
 */
export const WithDimensions = withContentRect('bounds')((p) => {
  const ref = p.measureRef;
  const b = p.contentRect.bounds;
  const width = b.width || 100;
  const aspectRatio = p.aspectRatio || 1.0;
  const height = width * aspectRatio;
  return (
    <div ref={ref} className={p.className}>
      {React.cloneElement(p.children, {width, height})}
    </div>
  );
});

export default WithDimensions;
