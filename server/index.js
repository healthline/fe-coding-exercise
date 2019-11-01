/* eslint-disable no-console */

'use strict';

const start = Date.now();
console.log('server spawn', Date.now() - start);

const Hapi = require('hapi');
const Good = require('good');

console.log('modules loaded', Date.now() - start);

const { cache } = require('./cache');
const ServerMethods = require('./lib/server-methods');

console.log('libs loaded', Date.now() - start);

const Next = require('./routes/next');

console.log('sys routes loaded', Date.now() - start);

const Data = require('./routes/data');

const reporters = {};

reporters.console = [{ module: 'good-console' }, 'stdout'];

const pluginOptions = [
  {
    options: { reporters },
    register: Good,
  },
  ServerMethods,
  Next,
  Data,
];

async function startServer() {
  console.log('startServer', Date.now() - start);

  let server;

  let termStart;
  process.on('SIGTERM', async () => {
    termStart = Date.now();
    console.log('SIGTERM', Date.now() - start);

    await Promise.all([
      // No guarantee that this will make it out, but give it a shot
      // datadog
      //   .logTerminate('signal', {
      //     load: server.load,
      //   })
      //   .then(() => console.log('logged', Date.now() - termStart)),
      await server
        .stop({
          timeout: 10000,
        })
        .then(() => console.log('stopped', Date.now() - termStart)),
    ]);

    console.log('exit', Date.now() - termStart);
    process.exit(128 + 15 /* SIGTERM */);
  });

  try {
    server = new Hapi.Server({
      cache,

      connections: {
        load: {
          maxEventLoopDelay: 10000,
        },
        routes: {
          log: true,
          state: {
            failAction: 'ignore',
          },
        },
      },
      load: {
        sampleInterval: 10,
      },
    });

    server.connection({
      port: 3000,
    });

    console.log('registerPlugins', pluginOptions.length, Date.now() - start);
    await server.register(pluginOptions);

    console.log('start server', Date.now() - start);
    await server.start();

    server.log(['startup'], `> Ready on ${server.info.port}`);
  } catch (error) {
    console.error(error);
    if (server) {
      server.log(['startup', 'error'], error);
    }
    process.exit(1);
  }
}

startServer();
