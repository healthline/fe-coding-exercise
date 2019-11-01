// Derived from https://github.com/csabapalfi/hapi-good-datadog/blob/master/index.js
//
// MIT licensed: https://github.com/csabapalfi/hapi-good-datadog/blob/master/package.json#L5
/* eslint-disable no-console */

'use strict';

const Os = require('os');
const gcStats = require('gc-stats');
const Dogapi = require('dogapi');

const GoodStream = require('./good-stream');

const gc = gcStats();

const { CIRCLE_BUILD_NUM, VPC_NAME } = process.env;

const defaultTags = ['app:frontend'];
const defaultClientTags = ['app:frontend'];

if (VPC_NAME) {
  defaultTags.push(`env:${VPC_NAME}`);
  defaultClientTags.push(`env:${VPC_NAME}`);
}
if (CIRCLE_BUILD_NUM) {
  defaultTags.push(`build:${CIRCLE_BUILD_NUM}`);
}

// Stub API if we are running in dev mode
const datadog = {
  gauge() {},
  histogram() {},
  increment() {},
};
const clientDatadog = {
  gauge() {},
  histogram() {},
  increment() {},
};

exports.datadog = datadog;
exports.clientDatadog = clientDatadog;

let totalGC = 0;

/* istanbul ignore next : Too complicated to test */
gc.on('stats', (stats) => {
  totalGC += stats.pause;

  datadog.histogram('server.memory.gc.pause', stats.pause, [
    `gcType:${stats.gctype}`,
  ]);
  datadog.gauge('server.memory.gc.freed', -stats.diff.usedHeapSize);
  datadog.gauge(
    'server.memory.executable',
    stats.after.totalHeapExecutableSize
  );
});

exports.logTerminate = (type, info) =>
  new Promise((resolve) => {
    Dogapi.event.create(
      `terminate: ${type}`,
      `terminate: ${type}

%%%
\`\`\`
${JSON.stringify(info, undefined, 2)}
\`\`\`
 %%%
`,
      {
        alert_type: 'warning',
        host: Os.hostname(),
        tags: defaultTags.concat(['terminate', `type:${type}`]),
      },
      (err, res) => {
        // No point doing further logging
        console.error(err, res);
        resolve();
      }
    );
  });

exports.reporter = [
  {
    args: [
      {
        listeners: {
          error(data) {
            const tags = [
              `route:${data.route}`,
              `method:${data.method}`,
              `error:${data.error.message}`,
            ];

            datadog.increment('server.error', 1, tags);

            console.error(data.error);
            Dogapi.event.create(
              data.error.message,
              `%%%
\`\`\`
${JSON.stringify(data, undefined, 2)}
\`\`\`
%%%`,
              {
                alert_type: 'error',
                date_happened: parseInt(data.timestamp / 1000, 10),
                host: Os.hostname(),
                tags: defaultTags.concat(tags),
              }
            );
          },
          log({ timestamp, tags, data }) {
            let title;
            let text;
            const type = tags.includes('error') ? 'error' : 'info';

            if (typeof data === 'string') {
              title = data;
            } else {
              title = tags.join(', ');
              text = JSON.stringify(data) || '';
            }

            // Filter out clientError events as we log them as metrics elsewhere
            if (title === 'connection, client, error') {
              return;
            }

            Dogapi.event.create(title, text, {
              alert_type: type,
              date_happened: parseInt(timestamp / 1000, 10),
              host: Os.hostname(),
              tags: defaultTags.concat(tags),
            });
          },
          ops(data) {
            const { proc, load, os } = data;

            datadog.gauge('server.uptime', proc.uptime);
            datadog.gauge('server.eventloop.delay', proc.delay);

            datadog.gauge('server.memory.rss', proc.mem.rss);
            datadog.gauge('server.memory.heapUsed', proc.mem.heapUsed);
            datadog.gauge('server.memory.heapTotal', proc.mem.heapTotal);

            datadog.gauge('server.memory.gc.pause.total', totalGC);

            let { concurrents, requests, responseTimes, sockets } = load;

            concurrents = Object.keys(concurrents).reduce(
              (prev, port) => prev + concurrents[port],
              0
            );

            responseTimes = Object.keys(responseTimes).reduce(
              (prev, port) => {
                const { avg, max } = responseTimes[port];
                return {
                  avg: prev.avg + avg,
                  max: prev.max + max,
                };
              },
              { avg: 0, max: 0 }
            );

            requests = Object.keys(requests).reduce(
              (prev, port) => {
                const { total, disconnects, statusCodes } = requests[port];
                Object.keys(statusCodes).forEach((code) => {
                  // eslint-disable-next-line no-param-reassign
                  prev.statusCodes[code] =
                    (prev.statusCodes[code] || 0) + statusCodes[code];
                });

                return {
                  disconnects: prev.disconnects + disconnects,
                  statusCodes: prev.statusCodes,
                  total: prev.total + total,
                };
              },
              { disconnects: 0, statusCodes: {}, total: 0 }
            );

            sockets = sockets.http.total + sockets.https.total;

            datadog.gauge('server.concurrents', concurrents);

            datadog.gauge('server.requests.total', requests.total);
            datadog.gauge('server.requests.disconnects', requests.disconnects);
            Object.keys(requests.statusCodes).forEach((code) => {
              datadog.gauge('server.requests', requests.statusCodes[code], [
                `code:${code}`,
                `serverError:${code >= 500}`,
                `clientError:${code >= 400}`,
              ]);
            });

            datadog.gauge('server.responseTimes.average', responseTimes.avg);
            datadog.gauge('server.responseTimes.max', responseTimes.max);

            datadog.gauge('server.upstream.sockets', sockets);

            datadog.gauge('server.os.loadavg.one', os.load[0]);
            datadog.gauge('server.os.loadavg.five', os.load[1]);
            datadog.gauge('server.os.loadavg.ten', os.load[2]);

            datadog.gauge('server.os.mem.total', os.mem.total);
            datadog.gauge('server.os.mem.free', os.mem.free);
          },
          response(data) {
            const tags = [
              `route:${data.route}`,
              `method:${data.method}`,
              `statusCode:${data.statusCode}`,
              `serverError:${data.statusCode >= 500}`,
              `clientError:${data.statusCode >= 400 && data.statusCode}`,
            ];

            datadog.increment('server.request', 1, tags);
            datadog.histogram(
              'server.request.duration',
              data.responseTime,
              tags
            );
          },
        },
      },
    ],
    module: GoodStream,
  },
];

exports.register = function register(server, options, next) {
  server.ext('onPreHandler', (request, reply) => {
    request.app.handlerStart = Date.now();
    return reply.continue();
  });
  server.ext('onPreResponse', (request, reply) => {
    const { route, response } = request;
    const tags = [
      `route:${route.path}`,
      `method:${route.method}`,
      `statusCode:${response.statusCode}`,
      `serverError:${response.statusCode >= 500}`,
      `clientError:${response.statusCode >= 400 && response.statusCode}`,
    ];
    datadog.histogram(
      'server.request.handler.duration',
      Date.now() - request.app.handlerStart,
      tags
    );
    return reply.continue();
  });

  next();
};
exports.register.attributes = {
  name: 'data-dog',
};
