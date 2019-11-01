/* eslint-disable no-underscore-dangle */
import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';
import themeGlobals from '../lib/theme-globals';

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    themeGlobals();
    const page = renderPage();
    const styles = extractCritical(page.html);

    return {
      ...page,
      ...styles,
    };
  }

  constructor(props) {
    super(props);
    const { __NEXT_DATA__, ids, siteNav } = props;
    __NEXT_DATA__.siteNav = siteNav;
    if (ids) {
      __NEXT_DATA__.stylesheetIds = ids;
    }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta content="en" httpEquiv="content-language" />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
