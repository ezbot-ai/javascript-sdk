import { logError } from '../../utils';

const documentIsParent = (): boolean => {
  const localDocument = document;
  try {
    return localDocument === top?.document;
  } catch (e) {
    if (e instanceof DOMException) {
      if (e.message.includes('Blocked a frame with origin')) {
        // the iframe is not from the same origin
        return false;
      }
    }
    logError(e as Error);
    return false;
  }
};

export { documentIsParent };
