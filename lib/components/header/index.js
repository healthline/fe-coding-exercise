import { PureComponent } from 'react';
import styled, { css } from 'react-emotion';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

import theme from '../../theme';
import ContentContainer from '../ui/layout/content-container';

const SMALL_HEADER_HEIGHT = 50;
const LARGE_HEADER_HEIGHT = 70;

const heightStyles = theme.mq({
  flex: 'none',
  width: '100%',
  height: [SMALL_HEADER_HEIGHT, LARGE_HEADER_HEIGHT],
});

const SiteHeader = styled.header([
  {
    alignItems: 'center',
    display: 'flex',
    left: 0,
    paddingBottom: 8,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 8,
    position: 'fixed',
    right: 0,
    top: 0,
    backgroundColor: 'white',
    borderBottom: `1px solid ${theme.color.gray[1]}`,
    zIndex: theme.zIndex.toolbars,
  },
  heightStyles,
]);

const navStyles = css({
  alignItems: 'center',
  display: 'flex',
  position: 'relative',

  // Stacking context created by the header element
  zIndex: 1,
}).toString();

const StyledLogo = styled.div({
  marginLeft: 15,
  [theme.breakpoints.mq[1]]: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 0,
  },
});

const LinkedLogo = pure(() => (
  <StyledLogo>
    <a
      event={{ action: 'Global Header', label: 'Logo Click' }}
      href="/"
      title="Healthline"
    >
      Engineering. Yay!
    </a>
  </StyledLogo>
));

export default class Header extends PureComponent {
  render() {
    return (
      <div css={heightStyles}>
        <SiteHeader id="site-header">
          <ContentContainer className={navStyles}>
            <LinkedLogo />
          </ContentContainer>
        </SiteHeader>
      </div>
    );
  }
}
