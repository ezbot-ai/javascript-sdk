/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/no-return-void */

const highlightClass = 'ezbot-highlighted';

const highlightStyle = {
  border: '2px solid red',
  backgroundColor: 'rgba(255, 0, 0, 0.2)',
};

const unhighlightAllElements = (): void => {
  const highlightedElements = document.querySelectorAll(`.${highlightClass}`);

  highlightedElements.forEach((element) => {
    if (!element || !(element instanceof HTMLElement)) {
      console.log(
        'Element is not an instance of HTMLElement, cannot unhighlight',
        element
      );
      return;
    }
    (element as HTMLElement).style.border = '';
    (element as HTMLElement).style.backgroundColor = '';
    element.classList.remove(highlightClass);
  });
};
const highlightElement = (element: HTMLElement): void => {
  unhighlightAllElements();
  element.style.border = highlightStyle.border;
  element.style.backgroundColor = highlightStyle.backgroundColor;
  element.classList.add(highlightClass);
};

export { highlightElement };
