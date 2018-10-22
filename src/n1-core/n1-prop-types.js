import PropTypes from 'prop-types';

export const N1PropTypes = PropTypes;

N1PropTypes.children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

N1PropTypes.route = N1PropTypes.shape({
  routePath: N1PropTypes.string.isRequired,
  paramValueByName: N1PropTypes.shape(),

  // true indicates this route won't be added to browser history, hence the browser location
  // field won't be updated. The page does load the new component of the new route though
  preventAddingHistory: N1PropTypes.bool,

  // true if this route is updated not by this app, but by browser location field
  updatedByBrowser: N1PropTypes.bool,
});
