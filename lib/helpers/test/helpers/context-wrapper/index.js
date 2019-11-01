import PropTypes from 'prop-types';
import withContext from 'recompose/withContext';

export default (context, Wrapper) => {
  const childContextTypes = {};
  Object.keys(context).forEach((name) => {
    childContextTypes[name] = PropTypes.any;
  });
  return withContext(childContextTypes, () => context)(Wrapper);
};
