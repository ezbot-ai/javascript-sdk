/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
import { LocalStyles } from '../types';

const defaultLocalStyles: LocalStyles = {
  '*': {
    cursor: 'pointer',
  },
  '.ezbot-highlight': {
    // border: '2px solid rgb(158, 66, 245)',
    'box-sizing': 'border-box',
    'background-color': 'rgba(158, 66, 245, 0.3)',
  },
};

const buildLocalStyles = (highlightColor: string): LocalStyles => {
  return {
    ...defaultLocalStyles,
    '.ezbot-highlight': {
      'box-sizing': 'border-box',
      'background-color': `${highlightColor}`,
    },
  };
};

const addLocalStyles = (styles: LocalStyles = defaultLocalStyles) => {
  // map over localStyles to create css string
  const stylesForHTML = Object.keys(styles).map((selector) => {
    const properties = Object.keys(styles[selector]).map((property) => {
      return `${property}: ${styles[selector][property]}`;
    });
    return `${selector} { ${properties.join(';')} }`;
  });
  const style = document.createElement('style');
  style.type = 'text/css';
  style.id = 'ezbot-local-styles';
  style.innerHTML = stylesForHTML.join(' ');
  document.head.appendChild(style);
};

const setLocalStyles = (styles: LocalStyles = defaultLocalStyles) => {
  removeLocalStyles();
  addLocalStyles(styles);
};

const removeLocalStyles = () => {
  const style = document.getElementById('ezbot-local-styles');
  if (style) {
    style.remove();
  }
};

export { addLocalStyles, removeLocalStyles, buildLocalStyles, setLocalStyles };
