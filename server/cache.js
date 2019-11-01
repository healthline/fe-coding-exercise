'use strict';

exports.methodCache = {
  hour: {
    expiresIn: 1 * 60 * 60 * 1000,
    generateTimeout: 60 * 1000,
    staleIn: 30 * 60 * 1000,
    staleTimeout: 60 * 1000,
  },
  prodHour(name) {
    /* istanbul ignore next: Prod config */
    if (process.env.NODE_ENV === 'production') {
      return Object.assign(
        {
          segment: `${name}-${process.env.CIRCLE_SHA1}`,
        },
        exports.methodCache.hour
      );
    }

    return undefined;
  },
};

exports.httpCache = {
  fiveMin: {
    expiresIn: 5 * 60 * 1000, // 5 min
    privacy: 'public',
  },
};
