/* eslint-disable no-console */
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);
  config.resolve.alias = {
    ...config.resolve.alias,
    'autotest/jest': path.resolve(__dirname, '../lib/helpers/test/nop'),
    'autotest/storybook': path.resolve(
      __dirname,
      '../lib/helpers/test/storybook',
    ),
    'next/same-loop-promise': require.resolve(
      '@kpdecker/next/dist/lib/same-loop-promise',
    ),
  };

  config.plugins.push(
    new DefinePlugin({
      changedTests: 'undefined',
    }),
    new NormalModuleReplacementPlugin(
      /lib\/dynamic\.js/,
      path.resolve(__dirname, './dynamic.stub.js'),
    ),
    new NormalModuleReplacementPlugin(
      /\/tracking\.js/,
      path.resolve(__dirname, './tracking.stub.js'),
    ),
    new NormalModuleReplacementPlugin(
      /lib\/analytics\/errors\.js/,
      path.resolve(__dirname, './errors.stub.js'),
    ),
  );

  return config;
};
