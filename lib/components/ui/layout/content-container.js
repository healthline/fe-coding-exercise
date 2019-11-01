// Provides centered max-width layout that is generally used for content in pages.
// Effectively implements the left most and rightmost dashed lines here:
// https://user-images.githubusercontent.com/27976202/38164571-802922dc-34bb-11e8-99e1-42b89bebd550.jpg
//
import styled from 'react-emotion';
import theme from '../../../theme';

export const contentContainerStyles = theme.mq({
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: theme.pageMaxWidth,
  width: theme.pageMargins.map(margin => `calc(100vw - ${margin * 2}px)`),
});

export default styled('div')(contentContainerStyles);
