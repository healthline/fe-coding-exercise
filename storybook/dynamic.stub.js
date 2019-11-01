// Simplified version to reduce
import { Component } from 'react';

// Only for test...
export const pending = [];

// Stub app vars
global.dataLayer = [];

export default function dynamicComponent(load, options) {
  const loading = load();
  pending.push(loading);

  return class DynamicComponent extends Component {
    state = { AsyncComponent: null };

    componentDidMount() {
      loading.then((m) => {
        if (!m) {
          throw new Error(`Unable to load component ${options.name}`);
        }

        const AsyncComponent = m.default || m;
        this.setState({ AsyncComponent });
      });
    }

    render() {
      const { AsyncComponent } = this.state;

      if (AsyncComponent) {
        return <AsyncComponent {...this.props} />;
      }

      return null;
    }
  };
}
