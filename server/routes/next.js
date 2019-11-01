'use strict';

const Raven = require('raven');
const next = require('@kpdecker/next');
const { renderToHTML } = require('@kpdecker/next/dist/server/render');

const { httpCache } = require('../cache');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: '.', quiet: true });

async function register(server) {
  await app.prepare();

  server.decorate('reply', 'nextPage', function nextPage(
    page,
    nextQuery,
    props
  ) {
    const { request } = this;

    // pass route params as internal query
    // Important: props must come last and must be a field, otherwise there
    // could be XSS concerns.
    const queryParams = Object.assign(request.query, nextQuery, { props });

    // Render and cache
    this.method(
      'nextPage',
      page,
      queryParams,
      request.raw.req.url,
      request.raw.req.headers['user-agent'],
      request.app
    );
  });

  server.method(
    'nextPage',
    (pagePath, queryParams, url, requestAppData) => {
      let statusCode = 200;
      let redirectLocation;
      let proxyLocation;

      // We are sending psuedo-request and response objects to the
      // renders to avoid potential cache errors due to generating
      // a cache object using a private req or response object.
      const mockReq = {
        stub: 'Static stub to avoid caching private data',
        url,
        app: requestAppData,
      };
      const mockRes = {
        code(_statusCode) {
          statusCode = _statusCode;
        },
        redirect(location) {
          statusCode = 301;
          redirectLocation = location;
        },
        stub: 'Static stub to avoid caching side effects',
      };

      Raven.captureBreadcrumb({
        category: 'next',
        data: {
          pagePath,
          queryParams,
        },
        level: 'info',
        message: `Rendering page ${pagePath}`,
      });

      // Render and cache
      return renderToHTML(
        mockReq,
        mockRes,
        pagePath,
        queryParams,
        app.renderOpts
      ).then(response => ({
        proxyLocation,
        queryParams,
        redirectLocation,
        response,
        statusCode,
      }));
    },
    {
      callback: false,
      generateKey(pagePath, queryParams) {
        return `${pagePath}:${Object.keys(queryParams).map(
          key => `${key}:${queryParams[key]}`
        )}`;
      },
    }
  );

  server.route({
    method: 'GET',
    path: '/',
    config: {
      cache: httpCache.fiveMin,
      tags: ['html'],
    },
    handler(req, reply) {
      reply.nextPage('/index');
    },
  });

  const defaultHandler = app.getRequestHandler();
  server.route({
    handler({ raw, url }, reply) {
      defaultHandler(raw.req, raw.res, url).then(() => {
        reply.close(false);
      });
    },
    method: 'GET',
    path: '/{p*}' /* catch all route */,
  });
}

exports.register = (server, options, callback) => {
  register(server).then(callback, callback);
};
exports.register.attributes = {
  name: 'next',
};
