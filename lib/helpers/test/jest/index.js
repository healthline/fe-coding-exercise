/* global it, expect */
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

export default ({ context, Component, exampleProps, title = '', useCases }) => {
  // Not ideal, but avoids having to deal with propagating adTargeting changes
  // to many files across the system
  const defaultContext = {
    registerSlot: () => {},
    adTargeting: {
      metadata: {
        canonical: 'canons',
      },
    },
  };

  const defaultUseCase = [
    {
      description: 'Default',
      props: exampleProps,
    },
  ];
  (useCases || defaultUseCase
  ).forEach(
    ({
      Component: ComponentProp,
      description,
      context: useCaseContext,
      props = exampleProps,
    }) => {
      const thisContext =
        (useCaseContext && { ...defaultContext, ...useCaseContext })
        || (context && { ...defaultContext, ...context })
        || defaultContext;
      const nextProps = props;
      it(`${title}: ${description}`, () => {
        const deriveComponent = ComponentProp ? (
          <ComponentProp {...nextProps} />
        ) : (
          <Component {...nextProps} />
        );
        const wrapper = shallow(deriveComponent, { context: thisContext });
        expect(toJson(wrapper, { noKey: true })).toMatchSnapshot();
      });
    },
  );
};
