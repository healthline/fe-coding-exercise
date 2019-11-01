/*

Supports V3 and V4

*/
import { storiesOf } from '@storybook/react';
import React from 'react';

import contextWrapper from '../helpers/context-wrapper';
import theme from '../../../theme';
import WrapperBasic from './wrappers/basic';

export default ({
  Component,
  context,
  exampleProps,
  preset,
  title,
  useCases,
  Wrapper = WrapperBasic,
}) => {
  if (!title) {
    throw new Error('Storybook tests must be named');
  }

  // Not ideal, but avoids having to deal with propagating adTargeting changes
  // to many files across the system
  const defaultContext = {
    registerSlot: () => {},
    getAdUnitPath: () => '/4788.test',
    adTargeting: {
      metadata: {
        canonical: 'canons',
      },
    },
  };

  const defaultUseCase = [
    {
      description: 'Default',
      props: { ...exampleProps, theme },
    },
  ];
  const LocalWrapper = contextWrapper(
    { ...defaultContext, ...context },
    Wrapper,
  );

  const stories = storiesOf(title, module);
  const components = [];
  (useCases || defaultUseCase).forEach(
    ({
      Component: ComponentProp,
      context: thisContext,
      description,
      props = exampleProps,
    }) => {
      const CaseWrapper = thisContext
        ? contextWrapper(thisContext, LocalWrapper)
        : LocalWrapper;
      const component = () => (
        <CaseWrapper>
          {ComponentProp ? (
            <ComponentProp {...props} />
          ) : (
            <Component {...props} />
          )}
        </CaseWrapper>
      );
      components.push({ title, description, component });
      stories.addWithPercyOptions(
        description,
        { widths: !preset || preset === 'sidebar' ? [1148] : [320, 1148] },
        component,
      );
    },
  );
  return stories;
};
