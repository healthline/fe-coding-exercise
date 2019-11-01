'use strict';

exports.register = (server, options, next) => {
  server.decorate('server', 'promise', async function method(name, ...args) {
    // const datadogTags = [`method:${name}`];

    // datadog.increment('server.method.executing', 1, datadogTags);

    return new Promise((resolve, reject) => {
      try {
        let syncRet = server.methods[name](
          ...args,
          (err, data, cache, report) => {
            // Caching enabled case
            if (report.error) {
              server.log(['server-method', 'error'], report.error);
            }

            // datadogTags.push(`cached:${!!cache}`, `isStale:${!!report.isStale}`);

            // datadog.increment('server.method', 1, datadogTags);
            // datadog.increment('server.method.executing', -1, datadogTags);
            // datadog.histogram('server.method.duration', report.msec, datadogTags);

            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );

        if (syncRet) {
          // Non-caching server methods. Generally this is in dev.
          syncRet = Promise.resolve(syncRet);

          resolve(
            syncRet.then(
              data =>
                // datadog.increment('server.method.executing', -1, datadogTags);

                data
            )
          );
        }
      } catch (e) {
        //eslint-disable-line
      }
    });
  });

  server.decorate('reply', 'method', async function method(name, ...args) {
    const reply = this;

    if (this.request.app.purgeCache && server.methods[name].cache) {
      await new Promise(resolve =>
        server.methods[name].cache.drop(...args, resolve)
      );
    }

    server
      .promise(name, ...args)
      .then((data) => {
        if (data && data.redirectLocation) {
          reply()
            .redirect(data.redirectLocation)
            .permanent();
        } else if (data && data.statusCode) {
          reply(data.response).code(data.statusCode);
        } else {
          reply(data);
        }
      })
      .catch(reply);
  });

  next();
};

exports.register.attributes = {
  name: 'server-methods',
};
