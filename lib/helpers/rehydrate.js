import { hydrate } from 'emotion-server';

// Adds server generated styles to emotion cache.
// Has to run before any `style()` calls
// '__NEXT_DATA__.stylesheetIds' is set in '_document.js'

// We limit the hydration to production enviornment so that source maps point to
// the line in which the original style was defined and not the Loc of the inserted
// optimized styles.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-underscore-dangle
  hydrate(window.__NEXT_DATA__.stylesheetIds);
}
