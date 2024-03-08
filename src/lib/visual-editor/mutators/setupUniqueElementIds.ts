/* eslint-disable functional/no-return-void */
import { v4 as uuidv4 } from 'uuid';

const setupUniqueElementIds = (): void => {
  const elements = document.querySelectorAll('*');
  elements.forEach((element) => {
    const elementId = uuidv4();
    element.setAttribute('data-ezbot-temp-id', elementId);
  });
};

export { setupUniqueElementIds };
