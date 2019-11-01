import { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../lib/components/header';
import TwoColumn, {
  MainColumn,
  Sidebar,
} from '../lib/components/ui/layout/two-column';

export default class FDAPage extends Component {
  static propTypes = {
    content: PropTypes.object,
    error: PropTypes.any,
  };

  static async getInitialProps() {
    return {
      content: [],
    };
  }

  render() {
    const { content, error } = this.props;
    console.log(content);

    if (error) {
      return <div>It Broke</div>;
    }

    return (
      <Fragment>
        <Header />
        <TwoColumn data-article-body>
          <MainColumn>Here are things!</MainColumn>
          <Sidebar>And maybe other things?</Sidebar>
        </TwoColumn>
      </Fragment>
    );
  }
}
