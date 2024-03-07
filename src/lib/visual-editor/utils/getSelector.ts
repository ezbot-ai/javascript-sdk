import { finder } from '@medv/finder';

const getSelector = (element: Readonly<Element>) => {
  // eslint-disable-next-line functional/no-let
  let selector = '';
  try {
    selector = finder(element, {
      seedMinLength: 3,
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
