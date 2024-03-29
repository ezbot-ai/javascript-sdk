/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
import { LocalStyles, SDKConfig } from '../types';

// Order matters
const defaultLocalStyles: LocalStyles = {
  '*': {
    cursor: 'pointer',
  },
  '.ezbot-element-variable-highlight': {
    'box-sizing': 'border-box',
    'background-color': 'rgba(66, 196, 245, 0.5) !important',
    border: '2px solid rgb(66, 196, 245)',
    transition: 'all 0.3s ease-out',
  },
  '.ezbot-element-highlight': {
    // border: '2px solid rgb(158, 66, 245)',
    'box-sizing': 'border-box',
    'background-color': 'rgba(158, 66, 245, 0.5) !important',
    border: '2px solid rgb(196, 55, 255)',
    transition: 'all 0.3s ease-out',
  },
  '.ezbot-hover': {
    'box-sizing': 'border-box',
    'background-color': 'rgba(158, 66, 245, 0.3)',
  },
};

const buildLocalStyles = (config: Readonly<SDKConfig>): LocalStyles => {
  return {
    ...defaultLocalStyles,
    '.ezbot-element-highlight': {
      'box-sizing': 'border-box',
      'background-color': `${config.highlightColor} !important`,
      border: '2px solid rgb(196, 55, 255)',
      transition: 'all 0.3s ease-out',
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
