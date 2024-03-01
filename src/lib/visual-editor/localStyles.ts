/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
type Styles = {
  [selector: string]: {
    [property: string]: string;
  };
};
const localStyles: Styles = {
  '*': {
    cursor: 'pointer',
  },
};
const setLocalStyles = () => {
  // map over localStyles to create css string
  const styles = Object.keys(localStyles).map((selector) => {
    const properties = Object.keys(localStyles[selector]).map((property) => {
      return `${property}: ${localStyles[selector][property]}`;
    });
    return `${selector} { ${properties.join(';')} }`;
  });
  const style = document.createElement('style');
  style.type = 'text/css';
  style.id = 'ezbot-local-styles';
  style.innerHTML = styles.join(' ');
  document.head.appendChild(style);
};
const removeLocalStyles = () => {
  const style = document.getElementById('ezbot-local-styles');
  console.log('removeLocalStyles', style);
  if (style) {
    style.remove();
  }
};

export { removeLocalStyles, setLocalStyles };
