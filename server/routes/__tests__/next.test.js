/* eslint-env jest */

'use strict';

jest.mock('@kpdecker/next', () => () => ({
  getRequestHandler() {
    return Promise.resolve(() => {});
  },
  prepare() {
    return Promise.resolve();
  },
}));
jest.mock('@kpdecker/next/dist/server/render', () => ({
  renderToHTML() {
    return Promise.resolve('html!');
  },
}));
jest.mock('../../lib/datadog');

const Hapi = require('hapi');
const ServerMethods = require('../../lib/server-methods');
const Next = require('../next');

let server;

describe('next routes', () => {
  beforeAll(() => {
    server = new Hapi.Server({
      debug: { request: ['error'] },
      load: {
        sampleInterval: 10,
      },
    });
    server.connection();
    return server.register([ServerMethods, Next]).then(() => server.start());
  });
  afterAll(() => server.stop());

  test('render content', () =>
    server.inject({ url: '/' }).then((res) => {
      expect(res.result).toEqual('html!');
    }));
});
