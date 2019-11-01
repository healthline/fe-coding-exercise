// Implements a the two column layout defined here.
// https://user-images.githubusercontent.com/27976202/38164571-802922dc-34bb-11e8-99e1-42b89bebd550.jpg
//
// Example:
//   <TwoColumn>
//     <MainColumn>foo</MainColumn>
//     <Sidebar>Optional</Sidebar>
//   <TwoColumn>
//
import styled from 'react-emotion';

import ContentContainer from './content-container';
import theme from '../../../theme';

const VerticalSplit = styled.div(({ marginTop, marginBottom }) =>
  theme.mq({
    display: ['block', 'block', 'flex'],
    justifyContent: 'space-between',
    width: '100%',
    marginTop,
    marginBottom,
  }),
);

export const MainColumn = styled.div(
  theme.mq({
    width: theme.mainColumnWidth,
    maxWidth: theme.mainColumnMaxWidth,
    position: 'relative',
  }),
);

export const Sidebar = styled.section(({ showOnMobile }) =>
  theme.mq({
    display: !showOnMobile && ['none', 'none', 'block'],
    flex: 'none',
    marginLeft: theme.gutterWidth,
    width: theme.sidebarWidth,
  }),
);

export default function TwoColumn(props) {
  return (
    <ContentContainer>
      <VerticalSplit {...props} />
    </ContentContainer>
  );
}
