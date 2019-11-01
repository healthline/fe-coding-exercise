/*

Style notes

  - Casing
    - H1: title-case
    - H2: sentence-case
    - H3: sentence-case
    - H4: sentence-case

*/
import { injectGlobal } from 'react-emotion';

import './reset-styles';

import theme, { tiemposFallback } from '../theme';

export default () => {
  const globals = {
    '*': {
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      imageRendering: 'crisp-edges',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    html: {
      boxSizing: 'border-box',
      color: theme.color.gray[5],
      lineHeight: 1.15,
      textSizeAdjust: '100%',
      cursor: 'default',
      fontFamily:
        '"Proxima Nova", -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", helvetica, Arial, arial, sans-serif',
      fontSize: 17,
    },
    'html, body': {
      height: '100%',
      width: '100%',
    },
    'button, .button': {
      fontFamily: 'inherit',
      fontSize: 14,
      lineHeight: '16px',
    },
    'cite, .cite': {
      marginBottom: 20,
      marginTop: 20,
      display: 'block',
      fontStyle: 'normal',
    },
    'figure, .figure': {
      fontSize: 0,
      lineHeight: 0,
      margin: 0,
    },
    'form, .form': {
      marginBottom: 0,
      marginTop: 0,
    },
    'h1, .h1': {
      fontFamily: `Tiempos, ${tiemposFallback}`,
      fontWeight: 600,
      fontSize: 32,
      lineHeight: '36px',
      marginBottom: 15,
      marginTop: 20,
    },
    'h2, .h2': {
      fontWeight: 700,
      position: 'relative',
      fontSize: 24,
      lineHeight: '30px',
      marginBottom: 15,
      marginTop: 30,
      // #2247 title shoudn't be floated
      clear: 'both',
    },
    'h3, .h3': {
      fontWeight: 700,
      fontSize: 20,
      lineHeight: '26px',
      marginBottom: 15,
      marginTop: 30,
      // #2451 title shouldn't be floated
      clear: 'both',
    },
    'h4, .h4': {
      fontWeight: 700,
      fontSize: 17,
      lineHeight: '26px',
      marginBottom: 15,
      marginTop: 20,
    },
    'hr, .hr': {
      border: 'none',
      borderTop: `1px solid ${theme.color.gray[1]}`,
      lineHeight: 0,
      marginBottom: 20,
      marginTop: 30,
    },
    'img, .img': {
      userSelect: 'none',
      maxWidth: '100%',
    },
    'iframe, .iframe': {
      maxWidth: '100%',
    },
    'li, .li': {
      fontSize: 17,
      lineHeight: '26px',
      marginBottom: 8,
    },
    'ol, .ol, ul, .ul': {
      marginBottom: 20,
      marginLeft: 20,
      marginTop: 15,
      paddingLeft: 25,

      '&.hl-long-line > li': {
        marginBottom: 15,
      },
    },
    'p, .p': {
      marginBottom: 20,
      marginTop: 20,
      fontSize: 17,
      lineHeight: '26px',
    },
    ul: {
      listStyleImage:
        "url(\"data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='5' cy='5' r='2.5' fill='%23EC1C82'/%3E%3C/svg%3E\")",
      '& li > ul': {
        listStyleImage:
          "url(\"data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='5' cy='5' r='2.5' fill='%23FFF' stroke='%23EC1C82'/%3E%3C/svg%3E\")",
      },
    },
    'small, .small': {
      fontSize: 14,
      lineHeight: '20px',
    },
    'table, .table': {
      borderCollapse: 'collapse',
      fontSize: 16,
      lineHeight: '24px',
    },
    '#__next, #__next > div, body > div:first-of-type': {
      height: '100%',
    },
    '#__next:empty, #__next > div:empty, body > div:first-of-type:empty': {
      height: 0,
    },
  };

  injectGlobal(globals, [
    `${theme.breakpoints.mq[1]} { html {
        line-height: 1.44;
        font-size: 18px;
      }}`,
    `${theme.breakpoints.mq[1]} { h1, .h1 {
        font-size: 48px;
        line-height: 52px;
        margin-bottom: 30px;
        margin-top: 30px;
      }}`,
    `${theme.breakpoints.mq[1]} { h2, .h2 {
        font-size: 38px;
        line-height: 42px;
        margin-top: 45px;
      }}`,
    `${theme.breakpoints.mq[1]} { h3, .h3 {
        font-size: 24px;
        margin-bottom: 20px;
        margin-top: 35px;
      }}`,
    `${theme.breakpoints.mq[1]} { h4, .h4 {
        font-size: 18px;
        margin-bottom: 20px;
        margin-top: 25px;
      }}`,
    `${theme.breakpoints.mq[1]} { ol, .ol, ul, .ul {
        margin-bottom: 25px;
        margin-top: 20px;
      }}`,
    `${theme.breakpoints.mq[1]} { cite, .cite {
        margin-bottom: 25px;
        margin-top: 25px;
      }}`,
    `${theme.breakpoints.mq[1]} { li, .li {
        font-size: 18px;
      }}`,
    `${theme.breakpoints.mq[1]} { p, .p {
        margin-bottom: 25px;
        margin-top: 25px;
        font-size: 18px;
      }}`,
  ]);
};
