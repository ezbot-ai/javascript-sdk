import { Prediction } from './types';

/**
 * Returns the first visual prediction matching the provided CSS selector.
 */
export function getVisualForSelector(
  predictions: ReadonlyArray<Prediction>,
  selector: string
): Prediction | undefined {
  return predictions.find(
    (pred) => pred.type === 'visual' && pred.config?.selector === selector
  );
}

/**
 * Converts visual predictions into a CSS string suitable for server-side rendering
 * within a single <style> tag.
 */
export function predictionsToCss(predictions: ReadonlyArray<Prediction>): string {
  const cssRules: string[] = [];

  for (const prediction of predictions) {
    if (!prediction || prediction.type !== 'visual' || !prediction.config) continue;

    const { selector, action, attribute } = prediction.config;
    const value = prediction.value;

    switch (action) {
      case 'hide':
        cssRules.push(`${selector} { display: none !important; }`);
        break;
      case 'show':
        cssRules.push(`${selector} { display: block !important; }`);
        break;
      case 'setStyle':
        if (attribute) {
          cssRules.push(`${selector} { ${attribute}: ${value} !important; }`);
        }
        break;
      case 'setFontSize':
        cssRules.push(`${selector} { font-size: ${value} !important; }`);
        break;
      case 'setFontColor':
        cssRules.push(`${selector} { color: ${value} !important; }`);
        break;
      case 'setBackgroundColor':
        cssRules.push(`${selector} { background-color: ${value} !important; }`);
        break;
      case 'setVisibility':
        cssRules.push(`${selector} { visibility: ${value} !important; }`);
        break;
      case 'addGlobalCSS':
        cssRules.push(value);
        break;
      default:
        // ignore unsupported actions in SSR CSS generation
        break;
    }
  }

  return cssRules.join('\n');
}
