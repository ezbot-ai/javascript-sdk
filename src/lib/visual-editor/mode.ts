/* eslint-disable functional/no-return-void */
import { unhighlightAllElements } from './highlighting';
import { setLocalStyles } from './localStyles';

const enableDefaultEvents = (): void => {
  const elements = document.querySelectorAll('*');
  elements.forEach((element) => {
    element.removeEventListener('click', (event) => {
      event.preventDefault();
    });
  });
};

const disableDefaultEvents = (): void => {
  const elements = document.querySelectorAll('*');
  elements.forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
    });
  });
};

const changeMode = (mode: Mode): void => {
  console.log('changeMode', mode);
  if (mode === 'interactive') {
    unhighlightAllElements();
    disableDefaultEvents();
    // save mode to session storage
    sessionStorage.setItem('ezbotVisualEditorMode', 'interactive');
  } else {
    enableDefaultEvents();
    setLocalStyles();
    sessionStorage.setItem('ezbotVisualEditorMode', 'ezbot');
  }
};
export { changeMode, Mode };
