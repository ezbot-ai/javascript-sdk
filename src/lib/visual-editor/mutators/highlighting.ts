/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/no-return-void */

import { logError } from '../../utils';
import { DBVariable } from '../types';

const highlightClass = 'ezbot-highlight';

const unhighlightAllElements = (): void => {
  const highlightedElements = document.querySelectorAll(`.${highlightClass}`);

  highlightedElements.forEach((element) => {
    if (!element || !(element instanceof HTMLElement)) {
      logError(
        new Error(
          'Element is not an instance of HTMLElement, cannot unhighlight'
        )
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
  element.classList.add(highlightClass);
};

function applyWrappingHiglight(variable: DBVariable) {
  if (!variable.config) {
    logError(new Error('No config found for visual variable'));
    return;
  }
  const element = document.querySelector(variable.config.selector);
  if (!element) {
    logError(new Error('No element found for visual variable'));
    return;
  }

  // Wrap a div around the element
  const wrapper = document.createElement('div');
  // give the wrapper a class of ezbot-wrapper
  wrapper.classList.add('ezbot-wrapper');
  // insert the wrapper before the element
  element.parentNode?.insertBefore(wrapper, element);
  // duplicate the original element
  const duplicate = element.cloneNode(true) as HTMLElement;
  // apply the class ezbot-original-element to the original element, hiding it
  element.classList.add('ezbot-original-element');
  // give the duplicate a class of ezbot-highlighted-element
  duplicate.classList.add('ezbot-highlighted-element');

  // create a new div that will show a counter of variations
  const counter = document.createElement('div');
  // give the counter a class of ezbot-counter
  counter.classList.add('ezbot-counter');
  // write text to the counter
  counter.textContent = `Allowed Values: ${variable.constraints.enumerables.length}`;

  // create a new div to contain information overlays
  const overlays = document.createElement('div');
  // give the overlays a class of ezbot-overlays
  overlays.classList.add('ezbot-overlays');

  // create a new div that will show the default value
  const defaultValue = document.createElement('div');
  // give the counter a class of ezbot-default-value
  defaultValue.classList.add('ezbot-default-value');
  // write text to the default value
  defaultValue.textContent = `Default Value: ${variable.defaultValue}`;
  // append the default value to the overlays
  overlays.appendChild(defaultValue);
  // append the counter to the wrapper
  overlays.appendChild(counter);

  // append the original element to the wrapper
  wrapper.appendChild(element);
  // append the duplicate to the wrapper
  wrapper.appendChild(duplicate);
  // append overlays to the wrapper
  wrapper.appendChild(overlays);
}

const highlightVariable = (variable: DBVariable): void => {
  if (!variable.config) {
    logError(new Error('No config found for visual variable'));
    return;
  }
  const element = document.querySelector(variable.config.selector);
  if (!element) {
    logError(new Error('No element found for visual variable'));
    return;
  }
  // add ezbot-variable-highlight class to the element
  const variableHighlightClass = `ezbot-variable-highlight`;
  element.classList.add(variableHighlightClass);

  // numAllowed values = # of allowed values + 1 if there is a default value
  const numAllowedValues =
    variable.constraints.enumerables.length + variable.defaultValue ? 1 : 0;

  // add an attribute called ezbot-num-allowed-values to the element
  element.setAttribute('ezbot-num-allowed-values', numAllowedValues.toString());
  // add an attribute called ezbot-default-value to the element
  element.setAttribute('ezbot-default-value', variable.defaultValue);

  // // On mouseover, display a hovering tool tip with the variable name and the number of allowed values
  // element.addEventListener('mouseover', () => {
  //   showTooltip();
  // });
  // // On mouseout, remove the hovering tool tip
  // element.addEventListener('mouseout', () => {
  //   hideTooltip();
  // });
};

export { highlightElement, unhighlightAllElements, highlightVariable };

// TODO: REMOVE ME
console.log(applyWrappingHiglight);
