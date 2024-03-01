/* eslint-disable functional/no-return-void */
type Mode = 'interactive' | 'ezbot';
import { removeLocalStyles, setLocalStyles } from './localStyles';

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
    removeLocalStyles();
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
