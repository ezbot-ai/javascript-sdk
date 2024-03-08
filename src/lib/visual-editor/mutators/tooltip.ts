/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */

import { logInfo } from '../../utils';

const setupTooltip = () => {
  const tooltip = document.createElement('div');
  tooltip.id = 'ezbot-tooltip';
  document.body.appendChild(tooltip);
};

const showTooltip = () => {
  logInfo('showing tooltip');
  const tooltip = document.getElementById('ezbot-tooltip');
  if (tooltip) {
    tooltip.style.display = 'block';
  }
};

const hideTooltip = () => {
  logInfo('hiding tooltip');
  const tooltip = document.getElementById('ezbot-tooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
};

export { setupTooltip, showTooltip, hideTooltip };
