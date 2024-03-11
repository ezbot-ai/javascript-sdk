import { logError } from '.';

const safeQuerySelector = (selector: string): HTMLElement | null => {
  // eslint-disable-next-line functional/no-let
  let element: HTMLElement | null = null;
  try {
    element = document.querySelector(selector);
  } catch (e) {
    logError(e as Error);
    element = null;
  }
  return element;
};

const safeQuerySelectorAll = (
  selector: string
): NodeListOf<HTMLElement> | null => {
  // eslint-disable-next-line functional/no-let
  let elements: NodeListOf<HTMLElement> | null = null;
  try {
    elements = document.querySelectorAll(selector);
  } catch (e) {
    logError(e as Error);
    elements = null;
  }

  return elements;
};

export { safeQuerySelector, safeQuerySelectorAll };
