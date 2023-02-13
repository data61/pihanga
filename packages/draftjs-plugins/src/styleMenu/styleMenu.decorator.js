// import React from 'react';

// import styled from './decorator.style';

// const Link = styled(({
//   entityKey,
//   contentState,
//   children,
//   classes,
// }) => {
//   const {url} = contentState.getEntity(entityKey).getData();
//   return (
//     <a href={url} style={classes.link}>
//       {children}
//     </a>
//   );
// });

// const decorators = [{
//   strategy: (contentBlock, callback, contentState) => {
//     contentBlock.findEntityRanges((span) => {
//       const entityKey = span.getEntity();
//       return (
//         entityKey !== null &&
//         contentState.getEntity(entityKey).getType() === 'f:link'
//       );
//     }, callback)
//   },
//   component: Link,
// }];
// export default decorators;
