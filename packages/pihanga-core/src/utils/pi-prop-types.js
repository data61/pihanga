import PropTypes from 'prop-types';

export const PiPropTypes = PropTypes;

PiPropTypes.children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

PiPropTypes.route = PiPropTypes.shape({
  routePath: PiPropTypes.string.isRequired,
  paramValueByName: PiPropTypes.shape(),

  // true indicates this route won't be added to browser history, hence the browser location
  // field won't be updated. The page does load the new component of the new route though
  preventAddingHistory: PiPropTypes.bool,

  // true if this route is updated not by this app, but by browser location field
  updatedByBrowser: PiPropTypes.bool,
});
