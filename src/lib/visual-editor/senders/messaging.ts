/* eslint-disable functional/no-return-void */
function postEventToParent(event: object): void {
  console.log('posting event to parent', event);
  window.parent.postMessage(event, '*');
}

function postMessageToParent(message: string): void {
  console.log('posting message to parent', message);
  window.parent.postMessage(message, '*');
}

export { postMessageToParent, postEventToParent };
