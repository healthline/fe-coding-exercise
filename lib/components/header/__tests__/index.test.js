import autoJest from 'autotest/jest';
import autoStorybook from 'autotest/storybook';

import ComponentBase from '../';

export const title = 'Header';
export const Component = ComponentBase;

export const exampleProps = {
  adTargeting: {},
  onToggleLeaderboard() {},
  onLeaderboardChange() {},
};

autoJest(module.exports);
autoStorybook(module.exports);
