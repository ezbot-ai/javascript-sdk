import { IncomingEvent } from './incoming-types';

const routeIncomingEvent = (event: IncomingEvent): boolean | Error => {
  throw new Error('Not implemented');
  //   if (event.type == 'highlightElement') {
  //     const { ezbotElement } = JSON.parse(data);
  //     console.log('ezbotElement', ezbotElement);
  //     const element = document.querySelector(ezbotElement.selector);
  //     if (!element) {
  //       logError('Element with selector not found', ezbotElement.selector);
  //       return;
  //     }
  //     highlightElement(element);
  //   } else if (event.type == 'changeMode') {
  //     console.log('calling ChangeMode');
  //     changeMode(event.mode);
  //   }
};

export { routeIncomingEvent };
