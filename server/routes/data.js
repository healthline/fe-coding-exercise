'use strict';

const { methodCache } = require('../cache');

exports.register = (server, options, next) => {
  server.promise('dataSource', async () => ['look!'], {
    cache: methodCache.hour,
    generateKey() {
      return 'data';
    },
  });

  server.route({
    method: 'GET',
    path: '/api/data',
    config: {
      tags: ['api'],
    },
    handler(req, reply) {
      reply.method('dataSource');
    },
  });

  next();
};

exports.register.attributes = {
  name: 'data',
};
