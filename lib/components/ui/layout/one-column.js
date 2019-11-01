// Implements a single column layout, without sidebar. This will follow
// the max width rules defined for column here.
// https://user-images.githubusercontent.com/27976202/38164571-802922dc-34bb-11e8-99e1-42b89bebd550.jpg
//
import styled from 'react-emotion';
import ContentContainer from './content-container';

import theme from '../../../theme';

const MainColumn = styled.div(({ centerContent, marginTop, marginBottom }) =>
  theme.mq(
    {
      width: theme.mainColumnWidth,
      maxWidth: theme.mainColumnMaxWidth,
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop,
      marginBottom,
    },
    centerContent && {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
  ),
);

export default function OneColumn(props) {
  return (
    <ContentContainer>
      <MainColumn {...props} />
    </ContentContainer>
  );
}
