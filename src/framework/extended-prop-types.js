import PropTypes from 'prop-types';

export const ExtendedPropTypes = PropTypes;

ExtendedPropTypes.route = ExtendedPropTypes.shape({
  // The path without protocol and domain name
  path: ExtendedPropTypes.string.isRequired,

  // Extra data passed with the route change.
  payload: ExtendedPropTypes.shape(),

  // Data passed in the path.
  // (Use this instead of payload to avoid losing data on browser refresh)
  //
  // Example:
  // Given that routing config is "/project/:id" and the current route path is "/project/2",
  // paramValueByName.id equals to 2.
  paramValueByName: ExtendedPropTypes.shape(),

  // true indicates this route won't be added to browser history, hence the browser location
  // field won't be updated. The page does load the new component of the new route though
  preventAddingHistory: ExtendedPropTypes.bool,
});
