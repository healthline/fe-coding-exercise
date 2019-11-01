import autoJest from 'autotest/jest';
import autoStorybook from 'autotest/storybook';

import ComponentBase from '../index';
import mock from './data/mock.json';

export const Component = ComponentBase;

export const title = 'Page: Data';
export const exampleProps = {};

export const useCases = [
  {
    description: 'Default',
    props: {
      ...exampleProps,
      content: mock.data,
    },
  },
  {
    description: 'Not Found',
    props: {
      url: {
        query: {
          url: '/foo',
        },
      },
      error: { status: 404 },
    },
  },
  {
    description: '500 Error',
    props: {
      url: {
        query: {
          url: '/foo',
        },
      },
      error: { status: 500 },
    },
  },
];

autoJest(module.exports);
autoStorybook(module.exports);
