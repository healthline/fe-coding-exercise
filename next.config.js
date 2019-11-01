const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

let lastState;
let lastStateTime;

module.exports = {
  assetPrefix: '/',
  clientBootstrap: ['./client/entry'],

  webpack: (config, { dev }) => {
    const $entry = config.entry;
    // eslint-disable-next-line
    config.entry = async () => {
      const entries = await $entry();
      // Filter test pages out of the entries list
      Object.keys(entries).forEach((entry) => {
        if (/\.test\.js/.test(entry)) {
          delete entries[entry];
        }
      });
      return entries;
    };
    // eslint-disable-next-line
    config.node = {
      ...config.node,
      process: false,
    };
    config.plugins.push(
      new DefinePlugin({
        'process.env.CIRCLE_SHA1': JSON.stringify(
          process.env.CIRCLE_SHA1 || '',
        ),
        'process.env.CIRCLE_BUILD_NUM': JSON.stringify(
          process.env.CIRCLE_BUILD_NUM || '',
        ),
        'process.env': '{}',
      }),
      new ProgressPlugin({
        handler(percentage, msg) {
          const state = msg.replace(/^\d+\/\d+\s+/, '');
          if (percentage === 0) {
            lastState = null;
            lastStateTime = Date.now();
          } else if (state !== lastState || percentage === 1) {
            const now = Date.now();
            if (lastState) {
              const stateMsg = `${now - lastStateTime}ms ${lastState}`;
              console.error(stateMsg); // eslint-disable-line no-console
            }
            lastState = state;
            lastStateTime = now;
          }
        },
        profile: true,
      }),
    );

    return config;
  },
};
