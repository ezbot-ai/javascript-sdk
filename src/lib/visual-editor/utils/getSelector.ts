import { finder } from '../../../vendor/finder';

const ignoreClasses = [
  'ezbot-element-highlight',
  'ezbot-element-variable-highlight',
  'ezbot-hover',
];

const getSelector = (element: Readonly<Element>) => {
  // eslint-disable-next-line functional/no-let
  let selector = '';
  try {
    selector = finder(element, {
      seedMinLength: 3,
      className: (name) => {
        return !ignoreClasses.includes(name);
      },
    });
  } catch (e) {
    selector =
      element.tagName.toLowerCase() +
      (element.id ? `#${element.id}` : '') +
      (element.className ? `.${element.className}` : '');
  }
  return selector;
};

export { getSelector };
