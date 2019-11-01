/*

Mobile min 280 + 20 * 2 = 320
Mobile max 550 + 20 * 2 = 590

Tablet min 658 + 55 * 2 = 768
Tablet max 879 + 55 * 2 = 989

Small desktop min 900 + 45 * 2 = 990
Small desktop max 1099 + 45 * 2 = 1189

Large desktop min 1100 + 45 * 2 = 1190
Large desktop max 1100

*/

import facepaint from 'facepaint';

const gutterWidth = 50;
const sidebarWidth = 300;

const theme = {
  // Max rendered width of the "page wrapper", the page should automatically
  // pad the content on the left and right beyond these in a given
  // breakpoint,
  pageMaxWidth: [590, 989, 1100, 1100],
  pageMargins: [20, 55, 45, 45],

  mainColumnMaxWidth: [550, 879, 750, 750],
  mainColumnWidth: [
    '100%',
    '100%',
    `calc(100% - ${gutterWidth + sidebarWidth}px)`,
  ],
  gutterWidth,
  sidebarWidth,
};

export const matchMediaQueries = [
  '(max-width: 767px)',
  '(min-width: 768px) and (max-width: 989px)',
  '(min-width: 990px) and (max-width: 1147px)',
  '(min-width: 1148px)',
];

function addMargin(value, i) {
  return value + theme.pageMargins[i] * 2;
}
const breakpointsWithMargin = [280, 658, 900, 1100].map(addMargin);
const breakpointMediaQueries = breakpointsWithMargin.map(
  val => `@media(min-width: ${val}px)`,
);

theme.transition = {
  cubicBezier: {
    enter: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
    exit: 'cubic-bezier(0.000, 0.000, 0.580, 1.000)',
  },
  timing: {
    enter: '750ms',
    exit: '150ms',
  },
};

theme.transition.enter = `${theme.transition.timing.enter} ${theme.transition.cubicBezier.enter}`;
theme.transition.exit = `${theme.transition.timing.exit} ${theme.transition.cubicBezier.exit}`;

theme.breakpoints = {
  location: breakpointsWithMargin,
  mq: breakpointMediaQueries,
};

theme.color = {
  blue: ['#05a2d3', '#04779b', '#046c8d', '#cdecf6', '#82d0e9'],
  gray: ['#f7f7f7', '#e5e5ea', '#bcbfc5', '#808184', '#404141', '#231f20'],
  green: ['#f2fbfb'],
  lime: ['#acc819'],
  magenta: ['#ec1c82'],
  orange: ['#f55035', '#d7452d'],
  pink: ['#ec1c82', '#b42072'],
  plum: ['#ab0dd1'],
  red: ['#fe2626', '#fee9e9'],
  tangerine: ['#f55035', '#fddcd7'],
  turquoise: ['#1dbab1', '#d2f1ef'],
  white: ['#ffffff'],
};

export const tiemposFallback =
  '"Georgia",georgia,"Times New Roman","Times",times,serif';

theme.font = {
  healthline: {
    fontFamily: 'healthline',
    fontStyle: 'normal',
    fontWeight: 400,
  },
  proximaNovaBold: {
    fontWeight: 700,
  },
  proximaNovaRegular: {
    fontWeight: 400,
  },
  proximaNovaSemiBold: {
    fontWeight: 600,
  },
  size: [14, 16, 24, 30],
  tiemposMedium: {
    fontFamily: `Tiempos, ${tiemposFallback}`,
    fontWeight: 600,
  },
};

theme.navbarHeight = [50, 70, 70, 70];

theme.zIndex = {
  newContext: 0,
  local: 1,
  ads: 300,
  toolbars: 400,
  modals: 500,
};

// The slice is due to the fact that we don't use the 320 breakpoint in practice.
// HERE BE DRAGONS: Talk to Kevin if you think you need to change this call. It
// impacts the whole app as well as the performance of our site.
theme.mq = facepaint(theme.breakpoints.mq.slice(1), { overlap: true });

export default theme;
